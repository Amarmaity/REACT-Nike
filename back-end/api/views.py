# api/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from api.permissions import IsAdmin
from api.utils import encrypt_data

from django.core.cache import cache
from django.utils import timezone

from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User
from api.serializers import UserSerializer
from api.utils import generate_otp, send_otp_via_email


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
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
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
        return Response({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    otp = generate_otp()
    cache_key = f"otp_{user.id}"

    cache.set(cache_key, otp, timeout=OTP_EXPIRY)
    send_otp_via_email(user.email, otp)

    return Response({"message": "OTP sent successfully"}, status=200)


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

    user_dict = UserSerializer(user).data
    encrypted_user = encrypt_data(user_dict)

    response = Response({
        "message": "OTP verified successfully",
        "user": encrypted_user
    })

    response.set_cookie(
        key="access",
        value=str(access),
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/"
    )

    response.set_cookie(
        key="refresh",
        value=str(refresh),
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=REFRESH_TOKEN_MAX_AGE,
        path="/"
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
        secure=False,
        samesite="Lax",
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/"
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

    user_dict = UserSerializer(request.user).data
    encrypted_user = encrypt_data(user_dict)

    return Response({
        "user": encrypted_user
    })



# ----------------------------
# Admin 
# ----------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_dashboard(request):
    return Response({
        "message": "Welcome admin",
        "user": encrypt_data
    })




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




