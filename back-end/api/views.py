# api/views.py
from api.permissions import IsAdminOrReadOnly, IsAdmin
import json

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle



from django.conf import settings
from django.core.cache import cache
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User, MasterCategory, SubCategory, Product, CustomerDetails
from api.serializers import (
    UserSerializer,
    MasterCategorySerializer,
    SubCategorySerializer,
    ProductSerializer,
    CustomerDetailsSerializer,
)
from api.services.email_service import send_otp_email


# ----------------------------
# Constants
# ----------------------------
OTP_EXPIRY = 300  # 5 minutes
IDLE_TIMEOUT = 60 * 60  # 1 hour
ACCESS_TOKEN_MAX_AGE = 15 * 60  # 15 minutes (match SIMPLE_JWT setting)
REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60  # 7 days (match SIMPLE_JWT setting)


# ----------------------------
# Throttle
# ----------------------------
class OTPThrottle(UserRateThrottle):
    rate = "5/min"


# ----------------------------
# Token helper
# ----------------------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return refresh, refresh.access_token


# ----------------------------
# Register
# ----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        user.set_unusable_password()
        user.save()

        return Response(
            {"message": "User registered successfully"}, status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# Login (send OTP)
# ----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([OTPThrottle])
def login(request):
    email = request.data.get("email")

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    otp = generate_otp()
    cache_key = f"otp_{user.id}"

    cache.set(cache_key, otp, timeout=OTP_EXPIRY)

    try:
        send_otp_email(
            to_email=user.email,
            otp=str(otp),
        )
    except Exception as exc:
        cache.delete(cache_key)

        response_data = {
            "error": "Unable to send OTP email. Please try again."
        }

        if settings.DEBUG:
            response_data["detail"] = str(exc)

        return Response(
            response_data,
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(
        {"message": "OTP sent successfully"},
        status=status.HTTP_200_OK,
    )

# ----------------------------
# Verify OTP
# ----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"error": "Email and OTP are required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    cache_key = f"otp_{user.id}"
    cached_otp = cache.get(cache_key)

    if not cached_otp:
        return Response({"error": "OTP expired"}, status=400)

    if str(cached_otp) != str(otp):
        return Response({"error": "Invalid OTP"}, status=400)

    cache.delete(cache_key)

    user.is_verified = True
    user.is_active = True
    user.save(update_fields=["is_verified", "is_active"])

    refresh, access = get_tokens_for_user(user)

    cache.set(f"last_activity_{user.id}", timezone.now(), timeout=IDLE_TIMEOUT)

    response = Response(
        {"message": "OTP verified successfully", "user": UserSerializer(user).data}
    )

    response.set_cookie(
        key="access",
        value=str(access),
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/",
    )

    response.set_cookie(
        key="refresh",
        value=str(refresh),
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=REFRESH_TOKEN_MAX_AGE,
        path="/",
    )

    return response


# ----------------------------
# Refresh token
# ----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh_token = request.COOKIES.get("refresh")

    if not refresh_token:
        return Response({"detail": "Refresh token missing"}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        access = refresh.access_token
    except Exception:
        return Response({"detail": "Invalid refresh token"}, status=401)

    response = Response({"message": "Token refreshed"})

    response.set_cookie(
        key="access",
        value=str(access),
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/",
    )

    return response


# ----------------------------
# Get user
# ----------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    key = f"last_activity_{request.user.id}"
    last_activity = cache.get(key)

    # Restore session cache if user has valid JWT but cache expired
    # This fixes login persistence after server restart or cache expiry
    if not last_activity:
        cache.set(key, timezone.now(), timeout=IDLE_TIMEOUT)
    else:
        cache.set(key, timezone.now(), timeout=IDLE_TIMEOUT)

    return Response({"user": UserSerializer(request.user).data})


# ----------------------------
# Admin
# ----------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_dashboard(request):
    return Response(
        {"message": "Welcome admin", "user": UserSerializer(request.user).data}
    )


# ----------------------------
# Logout
# ----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    refresh_token = request.COOKIES.get("refresh")

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass

    # Safely delete cache if user is authenticated
    if request.user and request.user.is_authenticated:
        cache.delete(f"last_activity_{request.user.id}")

    response = Response({"message": "Logout successful"})
    response.delete_cookie("access", path="/")
    response.delete_cookie("refresh", path="/")

    return response


# ---------------------------
# Add Master Category
# ---------------------------
@api_view(["GET", "POST"])
# @permission_classes([IsAuthenticated, IsAdmin])
@permission_classes([IsAdminOrReadOnly])
def add_master_category(request):
    try:
        if request.method == "GET":
            masterCategory = MasterCategory.objects.all().order_by("-created_at")
            status_filter = request.query_params.get("status")
            search = request.query_params.get("search")
            created_from = request.query_params.get("created_from")
            created_to = request.query_params.get("created_to")

            if status_filter:
                if status_filter.lower() == "active":
                    masterCategory = masterCategory.filter(is_active=True)
                elif status_filter.lower() == "inactive":
                    masterCategory = masterCategory.filter(is_active=False)

            if search:
                masterCategory = masterCategory.filter(
                    Q(name__icontains=search) | Q(slug__icontains=search)
                )

            if created_from:
                masterCategory = masterCategory.filter(
                    created_at__date__gte=created_from
                )

            if created_to:
                masterCategory = masterCategory.filter(created_at__date__lte=created_to)

            serializer = MasterCategorySerializer(masterCategory, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "POST":
            serializer = MasterCategorySerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()

                return Response(
                    {
                        "message": "Master category added successfully",
                        "name": serializer.data["name"],
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {"status": False, "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        return Response(
            {"status": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PATCH", "DELETE"])
# @permission_classes([IsAuthenticated, IsAdmin])
@permission_classes([IsAdminOrReadOnly])
def master_category_detail(request, category_id):
    try:
        master_category = get_object_or_404(MasterCategory, pk=category_id)

        if request.method == "GET":
            serializer = MasterCategorySerializer(master_category)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "DELETE":
            master_category.delete()
            return Response(
                {"message": "Master category deleted successfully"},
                status=status.HTTP_200_OK,
            )

        serializer = MasterCategorySerializer(
            master_category, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Master category updated successfully",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"status": False, "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )


# ---------------------------
# Add Sub Category
# ---------------------------
@api_view(["GET", "POST"])
# @permission_classes([IsAuthenticated, IsAdmin])
@permission_classes([IsAdminOrReadOnly])
def add_sub_category(request):
    try:

        if request.method == "GET":

            master_category = request.query_params.get("master_category")
            status_filter = request.query_params.get("status")
            search = request.query_params.get("search")
            created_from = request.query_params.get("created_from")
            created_to = request.query_params.get("created_to")
            subCategory = (
                SubCategory.objects.select_related("master_category")
                .all()
                .order_by("-created_at")
            )

            if master_category:
                try:
                    subCategory = subCategory.filter(
                        master_category_id=int(master_category)
                    )
                except (TypeError, ValueError):
                    return Response(
                        {
                            "status": False,
                            "message": "master_category must be a valid id",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            if status_filter:
                if status_filter.lower() == "active":
                    subCategory = subCategory.filter(is_active=True)
                elif status_filter.lower() == "inactive":
                    subCategory = subCategory.filter(is_active=False)

            if search:
                subCategory = subCategory.filter(
                    Q(name__icontains=search)
                    | Q(slug__icontains=search)
                    | Q(description__icontains=search)
                    | Q(master_category__name__icontains=search)
                )

            if created_from:
                subCategory = subCategory.filter(created_at__date__gte=created_from)

            if created_to:
                subCategory = subCategory.filter(created_at__date__lte=created_to)

            serializer = SubCategorySerializer(
                subCategory, many=True, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "POST":
            serializer = SubCategorySerializer(
                data=request.data, context={"request": request}
            )

            if serializer.is_valid():
                sub_category = serializer.save()
                return Response(
                    {
                        "message": "Sub category added successfully",
                        "data": SubCategorySerializer(
                            sub_category, context={"request": request}
                        ).data,
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {"status": False, "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def subcategory_detail(request, subcategory_id):
    try:
        subcategory = get_object_or_404(
            SubCategory.objects.select_related("master_category"),
            pk=subcategory_id,
        )

        if request.method == "GET":
            serializer = SubCategorySerializer(
                subcategory, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "DELETE":
            subcategory.delete()
            return Response(
                {"message": "Sub category deleted successfully"},
                status=status.HTTP_200_OK,
            )

        serializer = SubCategorySerializer(
            subcategory,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Sub category updated successfully",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"status": False, "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )


# ---------------------------
# Add Product
# ---------------------------
@api_view(["GET", "POST"])
# @permission_classes([IsAuthenticated, IsAdmin])
@permission_classes([IsAdminOrReadOnly])
def add_product(request):
    try:
        if request.method == "GET":
            products = (
                Product.objects.select_related(
                    "sub_category", "sub_category__master_category"
                )
                .prefetch_related("gallery_images", "variants__images")
                .order_by("-created_at")
            )

            master_category = request.query_params.get("master_category")
            sub_category = request.query_params.get("sub_category")
            product_type = request.query_params.get("type")
            status_filter = request.query_params.get("status")
            search = request.query_params.get("search")
            created_from = request.query_params.get("created_from")
            created_to = request.query_params.get("created_to")

            if master_category:
                products = products.filter(
                    sub_category__master_category_id=master_category
                )

            if sub_category:
                products = products.filter(sub_category_id=sub_category)

            if product_type:
                products = products.filter(product_type=product_type)

            if status_filter:
                if status_filter.lower() == "active":
                    products = products.filter(is_active=True)
                elif status_filter.lower() == "inactive":
                    products = products.filter(is_active=False)

            if search:
                products = products.filter(
                    Q(name__icontains=search)
                    | Q(sku__icontains=search)
                    | Q(slug__icontains=search)
                    | Q(tags__icontains=search)
                    | Q(sub_category__name__icontains=search)
                    | Q(sub_category__master_category__name__icontains=search)
                )

            if created_from:
                products = products.filter(created_at__date__gte=created_from)

            if created_to:
                products = products.filter(created_at__date__lte=created_to)

            serializer = ProductSerializer(
                products, many=True, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "POST":
            data = {key: request.data.get(key) for key in request.data.keys()}

            for field_name in ["options", "variations", "removed_gallery_image_ids", "tags"]:
                raw_value = request.data.get(field_name)

                if raw_value in [None, ""]:
                    continue

                if isinstance(raw_value, (list, dict)):
                    data[field_name] = raw_value
                    continue

                try:
                    data[field_name] = json.loads(raw_value)
                except json.JSONDecodeError:
                    return Response(
                        {
                            "status": False,
                            "message": f"{field_name} must be valid JSON",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            serializer = ProductSerializer(data=data, context={"request": request})

            if serializer.is_valid():
                product = serializer.save()
                return Response(
                    {
                        "message": "Product added successfully",
                        "data": ProductSerializer(
                            product, context={"request": request}
                        ).data,
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {"status": False, "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )




@api_view(["GET", "PATCH", "DELETE"])
# @permission_classes([IsAuthenticated, IsAdmin])
@permission_classes([IsAdminOrReadOnly])
def product_detail(request, product_id):
    try:
        product = get_object_or_404(
            Product.objects.select_related(
                "sub_category", "sub_category__master_category"
            ).prefetch_related("gallery_images", "variants__images"),
            pk=product_id,
        )

        if request.method == "GET":
            serializer = ProductSerializer(product, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "DELETE":
            product.delete()
            return Response(
                {"message": "Product deleted successfully"},
                status=status.HTTP_200_OK,
            )

        data = {key: request.data.get(key) for key in request.data.keys()}

        for field_name in ["options", "variations", "removed_gallery_image_ids", "tags"]:
            raw_value = request.data.get(field_name)

            if raw_value in [None, ""]:
                continue

            if isinstance(raw_value, (list, dict)):
                data[field_name] = raw_value
                continue

            try:
                data[field_name] = json.loads(raw_value)
            except json.JSONDecodeError:
                return Response(
                    {
                        "status": False,
                        "message": f"{field_name} must be valid JSON",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = ProductSerializer(
            product,
            data=data,
            context={"request": request},
            partial=True,
        )

        if serializer.is_valid():
            updated_product = serializer.save()
            refreshed_product = get_object_or_404(
                Product.objects.select_related(
                    "sub_category", "sub_category__master_category"
                ).prefetch_related("gallery_images", "variants__images"),
                pk=updated_product.pk,
            )
            return Response(
                {
                    "message": "Product updated successfully",
                    "data": ProductSerializer(
                        refreshed_product, context={"request": request}
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"status": False, "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def create_customer(request):

    if request.method == "GET":
        customer_list = CustomerDetails.objects.all()
        serializer = CustomerDetailsSerializer(customer_list, many=True)

        return Response(
            {"success": True, "data": serializer.data}, status=status.HTTP_200_OK
        )

    if request.method == "POST":
        serializer = CustomerDetailsSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                "success": True,
                "message": "Customer created successfully",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
