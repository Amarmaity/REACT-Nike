# views.py
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.cache import cache
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User
from api.serializers import UserSerializer
from api.utils import generate_otp, send_otp_via_email
from rest_framework.throttling import UserRateThrottle

# ----------------------------
# Constants
# ----------------------------
IDLE_TIMEOUT = 60 * 60  # 1 hour

# ----------------------------
# Throttling for OTP
# ----------------------------
class OTPThrottle(UserRateThrottle):
    rate = '5/min'

# ----------------------------
# Helper: generate JWT manually
# ----------------------------
def get_tokens_for_user(user):
    """
    Generate refresh and access tokens manually for any user model.
    """
    refresh = RefreshToken()
    refresh['user_id'] = user.id
    refresh['email'] = user.email
    return refresh, refresh.access_token

# ----------------------------
# User Registration
# ----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------
# Login: send OTP
# ----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    if not email:
        return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    otp = generate_otp()
    cache_key = f"otp_{user.id}"
    cache.set(cache_key, otp, timeout=300)  # OTP valid for 5 minutes

    send_otp_via_email(user.email, otp)
    return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)


# ----------------------------
# Verify OTP and generate JWT
# ----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return Response({"error": "email and otp are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        if not user.is_active:
            return Response({"error": "User is not active"}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    cache_key = f"otp_{user.id}"
    cached_otp = cache.get(cache_key)
    if cached_otp is None:
        return Response({"error": "OTP expired or already used"}, status=status.HTTP_400_BAD_REQUEST)
    if str(otp) != str(cached_otp):
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    # Mark user verified
    user.is_verified = True
    user.is_active = True
    user.save(update_fields=["is_verified", "is_active"])
    cache.delete(cache_key)

    # Generate JWT manually
    refresh, access = get_tokens_for_user(user)

    # Save last activity for idle timeout
    cache.set(f"last_activity_{user.id}", timezone.now(), timeout=IDLE_TIMEOUT)

    # Response with JWT cookies
    response = Response({
        "message": "OTP verified successfully",
        "user": UserSerializer(user).data,
        "id": user.id,
        "access": str(access),
        "refresh": str(refresh),
    }, status=status.HTTP_200_OK)

    response.set_cookie(
        key='access',
        value=str(access),
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    response.set_cookie(
        key='refresh',
        value=str(refresh),
        httponly=True,
        secure=False,
        samesite='Lax'
    )

    return response

# ----------------------------
# Logout
# ----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.user.is_authenticated:
        cache.delete(f"last_activity_{request.user.id}")
    response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    response.delete_cookie('access')
    response.delete_cookie('refresh')
    return response

# ----------------------------
# Get Current Authenticated User
# ----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    if request.user.is_authenticated:
        return Response({"user": UserSerializer(request.user).data}, status=status.HTTP_200_OK)
    return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
