import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_password_reset_email(to_email: str, raw_token: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your password"
    msg["From"] = f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM}>"
    msg["To"] = to_email

    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={raw_token}"
    body = (
        f"You requested a password reset.\n\n"
        f"Click the link below to reset your password:\n\n{reset_link}\n\n"
        f"This link expires in 1 hour. If you did not request this, ignore this email."
    )
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        smtp.sendmail(settings.MAIL_FROM, to_email, msg.as_string())
