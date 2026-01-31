from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from api.serializers import UserSerializer
from rest_framework.throttling import UserRateThrottle
from api.models import User
from api.utils import generate_otp, send_otp_via_email
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPThrottle(UserRateThrottle):
    rate = '5/min'


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')

    if not email:
        return Response({"message": "Email is required"})
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "User not found"})
    if user.email != email:
        return Response({"message": "Email does not match"})
    otp = generate_otp()
    cache_key = f"otp_{user.id}"
    cache.set(cache_key, otp, timeout=300)

    send_otp_via_email(user.email, otp)
    return Response({"message": "OTP sent successfully"},
                    status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return Response(
            {"error": "email and otp are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    cache_key = f"otp_{user.id}"
    cached_otp = cache.get(cache_key)

    if cached_otp is None:
        return Response(
            {"error": "OTP expired or already used"},
            status=status.HTTP_400_BAD_REQUEST
        )
    if str(otp) != str(cached_otp):
        return Response(
            {"error": "Invalid OTP"},
            status=status.HTTP_400_BAD_REQUEST
        )
    # Mark user verified
    user.is_verified = True
    user.is_active = True
    user.save(update_fields=["is_verified", "is_active"])
    # Delete OTP after success
    cache.delete(cache_key)

    refresh = RefreshToken.for_user(user)

    response = Response(
        {"message": "OTP verified successfully",
         "user": UserSerializer(user).data,
         "id": user.id},
        status=status.HTTP_200_OK)

    response.set_cookie(
        key='access',
        value=str(refresh.access_token),
        httponly=True,
        secure=False,
        samesite='Lax')

    response.set_cookie(
        key='refresh',
        value=str(refresh),
        httponly=True,
        secure=False,
        samesite='Lax')
    return response
