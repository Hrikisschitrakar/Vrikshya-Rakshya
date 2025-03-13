import os
from email.message import EmailMessage
import aiosmtplib
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

EMAIL_ADDRESS = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


async def send_reset_email(email_to: str, username: str, reset_link: str):
    """Send a password reset email."""
    message = EmailMessage()
    message["From"] = EMAIL_ADDRESS
    message["To"] = email_to
    message["Subject"] = "Password Reset Request"
    message.set_content(
        f"""
        Hi {username},

        We received a request to reset your password.
        Click the link below to reset it:

        {reset_link}

        If you did not request this, please ignore this email.

        Regards,
        Vrikshya Rakshya Team
        """
    )

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=EMAIL_ADDRESS,
        password=EMAIL_PASSWORD,
    )
