from config import db, bcrypt
from sqlalchemy import Index, func


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)  # Fixed 'Unique' to 'unique'
    _password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String(6))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())
    
    # Add discriminator column for polymorphic identity
    type = db.Column(db.String(50))

    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': type
    }

    @property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, password):
        self._password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password, password)
    
class Admin(User):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    
    # Relationship for status updates made by admin
    status_updates = db.relationship('StatusUpdate', back_populates='admin', cascade='all, delete-orphan')

    __mapper_args__ = {
        'polymorphic_identity': 'admin',
    }

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.is_admin = True

class RegularUser(User):
    __tablename__ = 'regular_users'

    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    phone_number = db.Column(db.String(20))

    # Relationships
    records = db.relationship('Record', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')

    __mapper_args__ = {
        'polymorphic_identity': 'regular_user',
    }

class Record(db.Model):
    __tablename__ = 'records'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    record_type = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='draft', nullable=False)  # Changed to String from Integer
    location = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('regular_users.id'), nullable=False)  # Fixed column capitalization
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    user = db.relationship('RegularUser', back_populates='records')
    comments = db.relationship('Comment', back_populates='record', cascade='all, delete-orphan')
    status_updates = db.relationship('StatusUpdate', back_populates='record', cascade='all, delete-orphan')  # Fixed name
    notifications = db.relationship('Notification', back_populates='record', cascade='all, delete-orphan')

    @property
    def can_be_modified(self):
        return self.status == 'draft'
    
class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('regular_users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())

    # Relationships
    user = db.relationship('RegularUser', back_populates='comments')
    record = db.relationship('Record', back_populates='comments')

class StatusUpdate(db.Model):
    __tablename__ = 'status_updates'

    id = db.Column(db.Integer, primary_key=True)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)
    old_status = db.Column(db.String(20), nullable=False)
    new_status = db.Column(db.String(20), nullable=False)
    comment = db.Column(db.Text)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())

    # Relationships
    record = db.relationship('Record', back_populates='status_updates')
    admin = db.relationship('Admin', back_populates='status_updates')

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())

    # Relationships
    user = db.relationship('User', backref='notifications')
    record = db.relationship('Record', back_populates='notifications')