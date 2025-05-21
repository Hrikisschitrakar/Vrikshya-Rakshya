from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

# Configure email settings (replace with your Gmail credentials)
conf = ConnectionConfig(
    MAIL_USERNAME="vrikshyarakshya@gmail.com",
    MAIL_PASSWORD="jzzf okhe gjfd kups",
    MAIL_FROM="vrikshyarakshya@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,  # Updated field name
    MAIL_SSL_TLS=False,  # Updated field name
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_email(to_email: str, subject: str, body: str,html: bool = False):
    # Create the email message
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=body,
        subtype="html" if html else "plain"
    )

    # Send the email
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

        