import os
import requests

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_otp_email(to_email, otp):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL")
    sender_name = os.getenv("BREVO_SENDER_NAME", "React Nike")

    if not api_key:
        raise Exception("BREVO_API_KEY not found")

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
        <h2>OTP Verification</h2>

        <p>Your OTP is:</p>

        <h1>{otp}</h1>

        <p>This OTP is valid for 10 minutes.</p>
        """,
    }

    response = requests.post(
        BREVO_API_URL,
        headers=headers,
        json=payload,
    )

    if response.status_code not in [200, 201]:
        raise Exception(response.text)

    return response.json()