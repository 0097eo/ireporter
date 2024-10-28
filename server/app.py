from config import app
from email.mime.text import MIMEText
import smtplib


def send_email(recipient, subject, body):
    sender = 'emmanuelokello294@gmail.com'
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login('emmanuelokello294@gmail.com', 'quzo ygrw gcse maim')
            smtp.send_message(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
        raise e

def send_verification_code(email, verification_code):
    subject = "IReporter: Verification Code"
    body = f"Your verification code is: {verification_code}"
    send_email(email, subject, body)

def send_status_update(email, title, new_status):
    subject = f"IReporter: Status Update"
    body = f"The record titles {title} has been updated to: {new_status}"
    send_email(email, subject, body)

if __name__ == '__main__':
    app.run(port=5555, debug=True)