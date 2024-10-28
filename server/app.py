from config import app, db, api
from email.mime.text import MIMEText
import smtplib
import secrets
from flask_restful import Resource
from flask import request
from models import User, RegularUser, Record
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from sqlalchemy import or_


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

class Records(Resource):
    def get(self):
        # Pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Search parameters
        search_query = request.args.get('q', '')
        record_type = request.args.get('type')
        
        # Base query
        query = Record.query
        
        # Apply search filters if provided
        if search_query:
            query = query.filter(
                or_(
                    Record.title.ilike(f'%{search_query}%'),
                    Record.description.ilike(f'%{search_query}%'),
                    Record.location.ilike(f'%{search_query}%'),
                    Record.status.ilike(f'%{search_query}%')
                )
            )
        
        # Filter by record type if provided
        if record_type:
            query = query.filter(Record.record_type == record_type)
        
        # Execute paginated query for all records
        paginated_records = query.order_by(Record.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Format response
        records = [{
            'id': record.id,
            'title': record.title,
            'description': record.description,
            'record_type': record.record_type,
            'location': record.location,
            'status': record.status,
            'created_at': record.created_at.isoformat(),
            'updated_at': record.updated_at.isoformat()
        } for record in paginated_records.items]
        
        return {
            'records': records,
            'total': paginated_records.total,
            'pages': paginated_records.pages,
            'current_page': page,
            'per_page': per_page
        }
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        new_record = Record(
            title=data['title'],
            description=data['description'],
            location=data['location'],
            record_type=data['record_type'],
            user_id=current_user_id,
            status='draft'
        )
        
        db.session.add(new_record)
        db.session.commit()
        
        return {
            'message': f'{data["title"]} record created successfully',
            'record_id': new_record.id
        }, 201
    
class UserRecords(Resource):
    @jwt_required()
    def get(self):
        """Protected endpoint to get authenticated user's records"""
        # Pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Search parameters
        search_query = request.args.get('q', '')
        record_type = request.args.get('type')
        
        # Base query for current user's records
        current_user_id = get_jwt_identity()
        query = Record.query.filter(Record.user_id == current_user_id)
        
        # Apply search filters if provided
        if search_query:
            query = query.filter(
                or_(
                    Record.title.ilike(f'%{search_query}%'),
                    Record.description.ilike(f'%{search_query}%'),
                    Record.location.ilike(f'%{search_query}%')
                )
            )
        
        # Filter by record type if provided
        if record_type:
            query = query.filter(Record.record_type == record_type)
        
        # Execute paginated query
        paginated_records = query.order_by(Record.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Format response
        records = [{
            'id': record.id,
            'title': record.title,
            'description': record.description,
            'record_type': record.record_type,
            'location': record.location,
            'status': record.status,
            'created_at': record.created_at.isoformat(),
            'updated_at': record.updated_at.isoformat()
        } for record in paginated_records.items]
        
        return {
            'records': records,
            'total': paginated_records.total,
            'pages': paginated_records.pages,
            'current_page': page,
            'per_page': per_page
        }
class RecordDetails(Resource):
    def get(self, record_id):
        """Public endpoint to get a specific record"""
        record = Record.query.get_or_404(record_id)
            
        return {
            'id': record.id,
            'title': record.title,
            'description': record.description,
            'record_type': record.record_type,
            'location': record.location,
            'status': record.status,
            'created_at': record.created_at.isoformat(),
            'updated_at': record.updated_at.isoformat()
        }

    @jwt_required()
    def put(self, record_id):
        current_user_id = get_jwt_identity()
        record = Record.query.filter_by(id=record_id, user_id=current_user_id).first()
        
        if not record:
            return {'message': 'Record not found or you do not have permission to modify it'}, 404
            
        if not record.can_be_modified:
            return {'message': 'Cannot modify record that is not in draft status'}, 403
            
        data = request.get_json()
        
        for key, value in data.items():
            if value is not None:
                setattr(record, key, value)
                
        db.session.commit()
        return {'message': 'Record updated successfully'}

    @jwt_required()
    def delete(self, record_id):
        current_user_id = get_jwt_identity()
        record = Record.query.filter_by(id=record_id, user_id=current_user_id).first()
        
        if not record:
            return {'message': 'Record not found or you do not have permission to delete it'}, 404
            
        if not record.can_be_modified:
            return {'message': 'Cannot delete record that is not in draft status'}, 403
            
        db.session.delete(record)
        db.session.commit()
        return {'message': 'Record deleted successfully'}
    
api.add_resource(RecordDetails, '/records/<int:record_id>')    
api.add_resource(UserRecords, '/user_records')
api.add_resource(Records, '/records')
api.add_resource(Register, '/register')
api.add_resource(Verify, '/verify')
api.add_resource(Login, '/login')

if __name__ == '__main__':
    app.run(port=5555, debug=True)