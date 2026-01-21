from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.throttling import UserRateThrottle
from .models import User
from .utils import generate_otp, send_otp_via_email
from django.core.cache import cache

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPThrottle(UserRateThrottle):
    rate = '5/min'

@api_view(['POST']) 
def login(request):
    username = request.data.get('username')
    email = request.data.get('email')

    if not username or not email:
        return Response({"message": "Username and email are required"})
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"message": "User not found"})
    
    if user.email != email:
        return Response({"message": "Email does not match"})
    
    otp = generate_otp()
    cache_key = f"otp_{user.id}"
    cache.set(cache_key, otp, timeout=300)

    send_otp_via_email(email, otp)
    return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
