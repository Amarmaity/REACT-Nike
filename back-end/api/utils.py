import random
import json
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from django.core.mail import send_mail
from django.conf import settings


# ================= OTP =================
def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_via_email(email, otp):
    subject = 'Your Login OTP'
    message = f'Your OTP for login is: {otp}'
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)
    return True


# ================= ENCRYPTION =================

SECRET_KEY = b"1234567890123456"  # 16 bytes only


def encrypt_data(data: dict) -> str:
    json_data = json.dumps(data).encode("utf-8")

    iv = get_random_bytes(16)
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)

    encrypted = cipher.encrypt(pad(json_data, AES.block_size))

    token = base64.b64encode(iv + encrypted).decode("utf-8")
    return token


def decrypt_data(token: str) -> dict:
    raw = base64.b64decode(token)

    iv = raw[:16]
    encrypted_data = raw[16:]

    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(encrypted_data), AES.block_size)

    return json.loads(decrypted.decode("utf-8"))
