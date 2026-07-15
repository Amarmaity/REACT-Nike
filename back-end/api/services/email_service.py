import logging
import os
from email.utils import formataddr, parseaddr

import requests
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_otp_email(to_email: str, otp: str) -> dict:
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    sender_name = os.getenv(
        "BREVO_SENDER_NAME",
        "React Nike",
    ).strip()

    if not api_key or not sender_email:
        return send_otp_email_with_django(to_email=to_email, otp=otp)

    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json",
    }

    payload = {
        "sender": {
            "name": sender_name,
            "email": sender_email,
        },
        "to": [
            {
                "email": to_email,
            }
        ],
        "subject": "Your OTP Verification",
        "htmlContent": f"""
            <div style="font-family: Arial, sans-serif;">
                <h2>OTP Verification</h2>

                <p>Your OTP is:</p>

                <h1 style="letter-spacing: 5px;">
                    {otp}
                </h1>

                <p>This OTP is valid for 5 minutes.</p>
            </div>
        """,
    }

    try:
        response = requests.post(
            BREVO_API_URL,
            headers=headers,
            json=payload,
            timeout=20,
        )

    except requests.Timeout:
        logger.warning("Brevo API request timed out; falling back to Django email backend")
        return send_otp_email_with_django(to_email=to_email, otp=otp)

    except requests.RequestException as exc:
        logger.warning(
            "Unable to connect to Brevo API; falling back to Django email backend: %s",
            exc,
        )
        return send_otp_email_with_django(to_email=to_email, otp=otp)

    if response.status_code not in (200, 201, 202):
        logger.warning(
            "Brevo API error [%s]; falling back to Django email backend: %s",
            response.status_code,
            response.text,
        )
        return send_otp_email_with_django(to_email=to_email, otp=otp)

    if response.content:
        return response.json()

    return {
        "status": "accepted",
    }


def get_django_from_email() -> str:
    default_from_email = settings.DEFAULT_FROM_EMAIL
    email_host_user = getattr(settings, "EMAIL_HOST_USER", "")
    email_host = getattr(settings, "EMAIL_HOST", "")

    if (
        email_host_user
        and "gmail.com" in email_host.lower()
        and parseaddr(default_from_email)[1].lower() != email_host_user.lower()
    ):
        return formataddr(("React Nike", email_host_user))

    return default_from_email


def send_otp_email_with_django(to_email: str, otp: str) -> dict:
    from_email = get_django_from_email()

    if not from_email:
        raise ImproperlyConfigured("DEFAULT_FROM_EMAIL is not configured")

    subject = "Your OTP Verification"
    message = f"Your OTP is: {otp}\n\nThis OTP is valid for 5 minutes."
    html_message = f"""
        <div style="font-family: Arial, sans-serif;">
            <h2>OTP Verification</h2>

            <p>Your OTP is:</p>

            <h1 style="letter-spacing: 5px;">
                {otp}
            </h1>

            <p>This OTP is valid for 5 minutes.</p>
        </div>
    """

    sent_count = send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=[to_email],
        html_message=html_message,
        fail_silently=False,
    )

    if sent_count != 1:
        raise Exception("Django email backend did not accept the OTP email")

    return {
        "status": "accepted",
        "provider": "django-email-backend",
    }

