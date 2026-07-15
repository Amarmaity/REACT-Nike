import logging
import os

import requests
from django.core.exceptions import ImproperlyConfigured

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_otp_email(to_email: str, otp: str) -> dict:
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    sender_name = os.getenv(
        "BREVO_SENDER_NAME",
        "React Nike",
    ).strip()

    if not api_key:
        raise Exception("BREVO_API_KEY is not configured")

    if not sender_email:
        raise Exception("BREVO_SENDER_EMAIL is not configured")

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

                <p>This OTP is valid for 10 minutes.</p>
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

    except requests.Timeout as exc:
        raise Exception(
            "Brevo API request timed out"
        ) from exc

    except requests.RequestException as exc:
        raise Exception(
            f"Unable to connect to Brevo API: {exc}"
        ) from exc

    if response.status_code not in (200, 201, 202):
        raise Exception(
            f"Brevo API error "
            f"[{response.status_code}]: {response.text}"
        )

    if response.content:
        return response.json()

    return {
        "status": "accepted",
    }