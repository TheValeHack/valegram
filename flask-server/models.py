from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex



class User(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(320), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=True)
    full_name = db.Column(db.String(120), nullable=True)
    profile_photo = db.Column(db.Text, nullable=True)
    bio = db.Column(db.String(500) , nullable=True)
    posts = db.relationship('Post', backref='post_user')
    comments = db.relationship('Comment', backref='comment_user')
    postlikes = db.relationship('PostLike', backref='postlike_user')
    commentlikes = db.relationship('CommentLike', backref='commentlike_user')
    postsaves = db.relationship('PostSave', backref='postsave_user')
    commentsaves = db.relationship('CommentSave', backref='commentsave_user')


class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    username = db.Column(db.String(32), nullable=False)
    profile_photo = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    caption = db.Column(db.String(2500), nullable=False)
    comments = db.relationship('Comment', backref='post')
    likes = db.relationship('PostLike', backref='user')
    saves = db.relationship('PostSave', backref='user')
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    username = db.Column(db.String(32), nullable=False)
    profile_photo = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.String(32), db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)
    likes = db.relationship('CommentLike', backref='user')
    saves = db.relationship('CommentSave', backref='user')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class PostLike(db.Model):
    __tablename__ = "postlikes"
    content = db.Column(db.Text, nullable=False)
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    post_id = db.Column(db.String(32), db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)

class CommentLike(db.Model):
    __tablename__ = "commentlikes"
    username = db.Column(db.String(32), nullable=False)
    profile_photo = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    comment_id = db.Column(db.String(32), db.ForeignKey('comments.id'), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)

class PostSave(db.Model):
    __tablename__ = "postsaves"
    content = db.Column(db.Text, nullable=False)
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    post_id = db.Column(db.String(32), db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)

class CommentSave(db.Model):
    __tablename__ = "commentsaves"
    username = db.Column(db.String(32), nullable=False)
    profile_photo = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    comment_id = db.Column(db.String(32), db.ForeignKey('comments.id'), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)

class Follower(db.Model):
    __tablename__ = "followers"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    following_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)
    followed_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)


class Notif(db.Model):
    __tablename__ = "notifs"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid, nullable=False)
    profile_photo = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(32), nullable=False)
    subject_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)
    target_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)
    post_id = db.Column(db.String(32), db.ForeignKey('posts.id'), nullable=True)
    comment_id = db.Column(db.String(32), db.ForeignKey('comments.id'), nullable=True)
    action = db.Column(db.String(32), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)