import logging
import os

import requests
from django.core.exceptions import ImproperlyConfigured

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_otp_email(to_email: str, otp: str) -> dict:
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    sender_name = os.getenv("BREVO_SENDER_NAME", "React Nike").strip()

    if not api_key:
        raise ImproperlyConfigured(
            "BREVO_API_KEY is missing from environment variables."
        )

    if not sender_email:
        raise ImproperlyConfigured(
            "BREVO_SENDER_EMAIL is missing from environment variables."
        )

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

                <p>This OTP is valid for 10 minutes.</p>
            </div>
        """,
    }

    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json",
    }

    try:
        response = requests.post(
            BREVO_API_URL,
            headers=headers,
            json=payload,
            timeout=20,
        )

        logger.info(
            "Brevo response status=%s body=%s",
            response.status_code,
            response.text,
        )

        response.raise_for_status()

        return response.json()

    except requests.Timeout as exc:
        logger.exception("Brevo API request timed out.")
        raise Exception(
            "Email service timed out. Please try again."
        ) from exc

    except requests.RequestException as exc:
        response_body = ""

        if exc.response is not None:
            response_body = exc.response.text

        logger.exception(
            "Brevo API error: %s",
            response_body,
        )

        raise Exception(
            f"Unable to send OTP email: {response_body or str(exc)}"
        ) from exc