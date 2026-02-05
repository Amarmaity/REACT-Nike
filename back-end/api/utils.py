import random
import json
from django.core.mail import send_mail
from django.conf import settings
from cryptography.fernet import Fernet


def generate_otp():
    """Generate a 6-digit OTP."""
    return str(random.randint(100000, 999999))


def send_otp_via_email(email, otp):
    """
    Send OTP to the given email.
    For now, this just prints to console for development.
    """
    subject = 'Your Login OTP'
    message = f'Your OTP for login is: {otp}'
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    # In production, uncomment the line below:
    send_mail(subject, message, email_from, recipient_list)
    # print(f"--------------------------------------------------")
    # print(f" [MOCK EMAIL] To: {email} | OTP: {otp} ")
    # print(f"--------------------------------------------------")
    return True


SECRET_KEY = Fernet.generate_key()
cipher = Fernet(SECRET_KEY)

def encrypt_data(data: dict):
    json_data = json.dumps(data)        # convert dict to string
    encrypted = cipher.encrypt(json_data.encode())
    return encrypted.decode()