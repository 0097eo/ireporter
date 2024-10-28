from config import app, db, api
from email.mime.text import MIMEText
import smtplib
import secrets
from flask_restful import Resource
from flask import request
from models import User, RegularUser
from flask_jwt_extended import create_access_token
from datetime import timedelta


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

class Register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        
        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            return {'message': "Username or email already in use"}
        
        verification_code = secrets.token_hex(3)
        new_user = RegularUser(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            verification_code=verification_code,
            is_verified=False
        )
        db.session.add(new_user)
        db.session.commit()

        try:
            send_verification_code(data['email'], verification_code)
            return {'message': 'Registration successful. Please check your email for verification code.'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'Failed to send verification email. Please try again later.'}, 500
        

class Verify(Resource):
    def post(self):
        data = request.get_json()
        email = data['email']
        verification_code = data['verification_code']

        if not email or not verification_code:
            return {'message': 'Invalid email or verification code'}, 400
        
        user = User.query.filter_by(email=email).first()

        if not user or user.verification_code!= verification_code:
            return {'message': 'Invalid verification code'}, 400
        
        user.is_verified = True
        user.verification_code = None
        db.session.commit()

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            if not user.is_verified:
                return {'message': 'Please verify your email before logging in.'}, 401
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=10))
            user_type = 'admin' if user.is_admin else 'customer'
            return {'access_token': access_token, 'user_type': user_type}, 200
        return {'message': 'Invalid credentials'}, 401




api.add_resource(Register, '/register')
api.add_resource(Verify, '/verify')
api.add_resource(Login, '/login')
if __name__ == '__main__':
    app.run(port=5555, debug=True)