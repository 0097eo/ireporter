from faker import Faker
from sqlalchemy.exc import IntegrityError
from models import db, User, Admin, RegularUser, Record, Comment, StatusUpdate, Notification
from app import app
import random

fake = Faker()

def clear_data():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        # Recreate all tables
        db.create_all()
        print("All data cleared from the database.")

def create_admin():
    """Create an admin user"""
    admin = Admin(
        username=fake.user_name(),
        email=fake.email(),
        password='adminpass123',
        is_verified=True,
        verification_code='123456'
    )
    db.session.add(admin)
    db.session.commit()
    return admin

def create_regular_users(num_users=10):
    """Create regular users"""
    users = []
    for _ in range(num_users):
        user = RegularUser(
            username=fake.user_name(),
            email=fake.email(),
            password='userpass123',
            is_verified=random.choice([True, False]),
            verification_code='123456',
            phone_number=fake.phone_number()
        )
        try:
            db.session.add(user)
            db.session.commit()
            users.append(user)
        except IntegrityError:
            db.session.rollback()
            continue
    return users

def create_records(users, num_records_per_user=3):
    """Create records for users"""
    records = []
    record_types = ['complaint', 'suggestion', 'inquiry', 'feedback']
    statuses = ['draft', 'pending', 'under_review', 'resolved', 'rejected']
    
    for user in users:
        for _ in range(num_records_per_user):
            record = Record(
                title=fake.sentence(),
                description=fake.paragraph(),
                record_type=random.choice(record_types),
                status=random.choice(statuses),
                location=fake.city(),
                user_id=user.id
            )
            db.session.add(record)
            records.append(record)
    
    db.session.commit()
    return records

def create_comments(users, records, num_comments_per_record=2):
    """Create comments on records"""
    comments = []
    for record in records:
        for _ in range(num_comments_per_record):
            user = random.choice(users)
            comment = Comment(
                content=fake.paragraph(),
                user_id=user.id,
                record_id=record.id
            )
            db.session.add(comment)
            comments.append(comment)
    
    db.session.commit()
    return comments

def create_status_updates(admin, records):
    """Create status updates for records"""
    statuses = ['draft', 'pending', 'under_review', 'resolved', 'rejected']
    
    for record in records:
        # Create 1-3 status updates per record
        for _ in range(random.randint(1, 3)):
            old_status = random.choice(statuses)
            new_status = random.choice([s for s in statuses if s != old_status])
            
            status_update = StatusUpdate(
                record_id=record.id,
                old_status=old_status,
                new_status=new_status,
                comment=fake.sentence(),
                admin_id=admin.id
            )
            db.session.add(status_update)
    
    db.session.commit()

def create_notifications(users, records):
    """Create notifications for users"""
    notification_messages = [
        "Your record has been updated",
        "New comment on your record",
        "Status change on your record",
        "Your record is under review",
        "Your record has been resolved"
    ]
    
    for record in records:
        # Create 1-3 notifications per record
        for _ in range(random.randint(1, 3)):
            notification = Notification(
                user_id=record.user_id,
                record_id=record.id,
                message=random.choice(notification_messages)
            )
            db.session.add(notification)
    
    db.session.commit()

def seed_database():
    """Main function to seed the database"""
    with app.app_context():
        # Create admin user
        admin = create_admin()
        print("Created admin user")

        # Create regular users
        users = create_regular_users(10)
        print(f"Created {len(users)} regular users")

        # Create records
        records = create_records(users, 3)
        print(f"Created {len(records)} records")

        # Create comments
        comments = create_comments(users, records, 2)
        print(f"Created {len(comments)} comments")

        # Create status updates
        create_status_updates(admin, records)
        print("Created status updates")

        # Create notifications
        create_notifications(users, records)
        print("Created notifications")

if __name__ == '__main__':
    clear_data()
    seed_database()
    print('Database seeded successfully!')