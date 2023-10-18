from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from config import ApplicationConfig
from models import db, User, Post, Comment, PostLike, CommentLike, PostSave, CommentSave, Follower, Notif
from flask_cors import CORS
import re

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
app.config['CORS_HEADERS'] = 'Content-Type'


bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins="*")
db.init_app(app)


with app.app_context():
    db.create_all()

# Supporting Functions
def isEmailValid(email):
    email_pattern = r'^[\w\.-]+@[\w\.-]+$'
    
    if re.match(email_pattern, email) and (len(email) <= 320):
        return True
    else:
        return False
    
def isUsernameValid(username):
    username_pattern = r"^[a-zA-Z0-9][a-zA-Z0-9_.]*$"
    
    if re.match(username_pattern, username) and (len(username) <= 32) and (len(username) >= 3):
        return True
    else:
        return False

def isUserLogged():
    return 'user_id' in session

def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))
    
    return d

# Routers

# Register
@app.route("/register/", methods=["POST", "GET"], endpoint="register")
def register():
    if isUserLogged():
        return jsonify({
            "message": "Anda sudah login!"
        }), 401

    email = request.json["email"].lower()
    password = request.json["password"]
    username = request.json["username"].lower()
    profile_photo = request.json["profile_photo"]
    full_name = request.json["full_name"]
    bio = request.json["bio"]

    checkEmail = User.query.filter_by(email=email).first()
    checkUsername = User.query.filter_by(username=username).first()

    if not isEmailValid(email):
        return jsonify({
            "error": "format email salah!"
        }),409
    if not isUsernameValid(username):
        return jsonify({
            "error": "format username salah!"
        }),409
    if checkEmail is not None:
        return jsonify({
            "error": "email sudah terdaftar!"
        }),409
    if checkUsername is not None:
        return jsonify({
            "error": "username sudah terdaftar!"
        }),409

    hashedPass = bcrypt.generate_password_hash(password)
    createUser = User(username=username, email=email, password=hashedPass, full_name=full_name, profile_photo=profile_photo, bio=bio)
    db.session.add(createUser)
    db.session.commit()

    return jsonify({
        "message": "login berhasil"
    })


# Login
@app.route("/login/", methods=["POST"], endpoint="login")
def login():
    if isUserLogged():
        return jsonify({
            "error": "Anda sudah login!"
        }), 401

    acc = request.json["acc"].lower()
    password = request.json["password"]

    if isEmailValid(acc):
        userAcc = User.query.filter_by(email=acc).first()
    else:
        userAcc = User.query.filter_by(username=acc).first()
    
    if userAcc is None:
        respJson = jsonify({
            "error": "Kredensial akun salah!"
        })
        return respJson, 409
    if not bcrypt.check_password_hash(userAcc.password, password):
        respJson = jsonify({
            "error": "Kredensial akun salah!"
        })
        respJson.headers.add("Access-Control-Allow-Origin", "*")
        return respJson, 409
    
    session["user_id"] = userAcc.user_id
    return jsonify({
        "id": userAcc.user_id,
        "username": userAcc.username,
        "email": userAcc.email,
        "full_name": userAcc.full_name,
        "profile_photo": userAcc.profile_photo,
        "bio": userAcc.bio
    })
    
# Update
@app.route('/update/', methods=["PUT"], endpoint="update")
def update():
    username = request.json["username"].lower()
    profile_photo = request.json["profile_photo"]
    full_name = request.json["full_name"]
    bio = request.json["bio"]

    user_id = session.get("user_id")
    user = User.query.filter_by(user_id=user_id).first()

    userAcc = User.query.filter_by(username=username).first()
    if (userAcc is not None) and (userAcc.username != user.username):
        return jsonify({
            "error": "username sudah ada!"
        }), 409
    
    
    user.username = username
    user.profile_photo = profile_photo
    user.full_name = full_name
    user.bio = bio

    db.session.commit()

    return jsonify({
        "message": "register berhasil"
    })
        

# Logout
@app.route("/logout/", endpoint="logout")
def logout():
    session.pop('user_id', None)
    session.clear()

    return jsonify({
        "message": "Logout berhasil!"
    })


# Delete
@app.route("/delete/", methods=["DELETE"], endpoint="delete")
def delete():
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user_id = session.get('user_id')
    user = User.query.filter_by(user_id=user_id).first()

    db.session.delete(user)
    db.session.commit()


    session.pop('user_id', None)
    session.clear()

    return jsonify({
        "message": "Delete berhasil!"
    })



# Users
# Get all users
@app.route("/api/users/")
def users():
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    users = User.query.all()
    users_data = []

    for user in users:
        users_data.append(
            {
                "profile_photo": user.profile_photo,
                "user_id": user.user_id,
                "username": user.username,
                "full_name": user.full_name,
                "bio": user.bio
            }
        )
    
    return jsonify(users_data)


# Get current user data
@app.route("/api/users/mydata/")
def users_get_mydata():
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user = User.query.filter_by(user_id=session.get("user_id")).first()
    user_data = row2dict(user)
    del user_data["password"]
    
    return jsonify(user_data)

# Get current user notifications
@app.route("/api/users/mynotifications/")
def users_get_mynotifications():
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user_id = session.get("user_id")
    notifs = Notif.query.filter_by(target_id=user_id).all()
    notifs_data = [row2dict(notif) for notif in notifs]
    
    return jsonify(notifs_data)


# Follow user
@app.route("/api/users/<string:user_id>/follow/", methods=["POST"])
def users_follow(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    cur_user_id = session.get("user_id")
    follow = Follower.query.filter_by(**{"following_id":cur_user_id, "followed_id":user_id}).first()
    profile_photo = user.profile_photo
    username = user.username

    if cur_user_id == user_id:
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409

    if follow is not None:
        return jsonify({
            "message": "Akun sudah di follow!"
        })
    
    followed = Follower(following_id=cur_user_id, followed_id=user_id)
    db.session.add(followed)
    db.session.commit()
    
    notification = Notif(username=username, profile_photo=profile_photo, subject_id=cur_user_id, target_id=user_id, action="follow", post_id=None, comment_id=None)
    
    db.session.add(notification)
    db.session.commit()

    return jsonify({
        "message":  "Akun berhasil di follow!"
    })

# Unfollow user
@app.route("/api/users/<string:user_id>/unfollow/",  methods=["POST"])
def users_unfollow(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    cur_user_id = session.get("user_id")
    follow = Follower.query.filter_by(**{"following_id":cur_user_id, "followed_id":user_id}).first()

    if cur_user_id == user_id:
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409

    if not follow:
        return jsonify({
            "message": "Akun sudah di unfollow!"
        })
    
    db.session.delete(follow)
    db.session.commit()
    
    return jsonify({
        "message": "Akun berhasil di unfollow!"
    })


# Search Users
@app.route("/api/users/search/<string:query>/")
def users_search(query):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    users = User.query.filter(User.username.like(f'%{query}%')).all()
    users_data = []

    for user in users:
        users_data.append(
            {
                "profile_photo": user.profile_photo,
                "user_id": user.user_id,
                "username": user.username,
                "full_name": user.full_name,
                "bio": user.bio
            }
        )
    
    return jsonify(users_data)

# Get user data
@app.route("/api/users/<string:user_id>/")
def users_get(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_data = {
        "profile_photo": user.profile_photo,
        "user_id": user.user_id,
        "username": user.username,
        "full_name": user.full_name,
        "bio": user.bio
    }
    
    return jsonify(user_data)

# Get user posts
@app.route("/api/users/<string:user_id>/posts/")
def users_get_posts(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404
    
    posts_data = []
    for post in user.posts:
        post_data = row2dict(post)
        likes_count = len(post.likes) if post.likes else 0
        comments_count = len(post.comments) if post.comments else 0
        post_data["likes"] = likes_count
        post_data["comments"] = comments_count
        posts_data.append(post_data)
    
    return jsonify(posts_data)


# User follow status
@app.route("/api/users/<string:user_id>/followstatus/")
def users_followstatus(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    cur_user_id = session.get("user_id")

    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    follow = Follower.query.filter_by(**{"following_id":cur_user_id, "followed_id":user_id}).first()


    if follow is not None:
        return jsonify({
            "follow": True
        })
    else:
        return jsonify({
            "follow": False
        })
    
# Get user followings
@app.route("/api/users/<string:user_id>/followings/")
def users_get_followings(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    
    user = User.query.filter_by(user_id=user_id).first()
    follows = Follower.query.filter_by(following_id=user_id).all()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    followings_data = [row2dict(follow) for follow in follows]
    
    return jsonify(followings_data)

# Get user followers
@app.route("/api/users/<string:user_id>/followers/")
def users_get_followers(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    
    user = User.query.filter_by(user_id=user_id).first()
    follows = Follower.query.filter_by(followed_id=user_id).all()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    followers_data = [row2dict(follow) for follow in follows]
    
    return jsonify(followers_data)

# Get user comments
@app.route("/api/users/<string:user_id>/comments/")
def users_get_comments(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    if user_id != session.get("user_id"):
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    comments_data = []
    for comment in user.comments:
        comments_data.append({
            "comment_id": comment.id,
            "content": comment.content,
            "likes": len(comment.likes) if comment.likes else 0
        })
    
    return jsonify(comments_data)

# Get user post likes
@app.route("/api/users/<string:user_id>/postlikes/")
def users_get_postlikes(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    if user_id != session.get("user_id"):
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    postlikes_data = []
    for postlike in user.postlikes:
        postlikes_data.append({
            "content": postlike.content,
            "postlike_id": postlike.id,
            "post_id": postlike.post_id,
            "user_id": postlike.user_id
        })
    
    return jsonify(postlikes_data)

# Get user comment likes
@app.route("/api/users/<string:user_id>/commentlikes/")
def users_get_commentlikes(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    if user_id != session.get("user_id"):
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    commentlikes_data = []
    for commentlike in user.commentlikes:
        commentlikes_data.append({
            "profile_photo": commentlike.profile_photo,
            "username": commentlike.username,
            "content": commentlike.content,
            "commentlike_id": commentlike.id,
            "comment_id": commentlike.comment_id,
            "user_id": commentlike.user_id
        })
    
    return jsonify(commentlikes_data)

# Get user post saves
@app.route("/api/users/<string:user_id>/postsaves/")
def users_get_postsaves(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    if user_id != session.get("user_id"):
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    postsaves_data = []
    for postsave in user.postsaves:
        postsaves_data.append({
            "content": postsave.content,
            "postsave_id": postsave.id,
            "post_id": postsave.post_id,
            "user_id": postsave.user_id
        })
    
    return jsonify(postsaves_data)

# Get user comment saves
@app.route("/api/users/<string:user_id>/commentsaves/")
def users_get_commentsaves(user_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    if user_id != session.get("user_id"):
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409
    
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    commentsaves_data = []
    for commentsave in user.commentsaves:
        commentsaves_data.append({
            "profile_photo": commentsave.profile_photo,
            "username": commentsave.username,
            "content": commentsave.content,
            "commentsave_id": commentsave.id,
            "comment_id": commentsave.comment_id,
            "user_id": commentsave.user_id
        })
    
    return jsonify(commentsaves_data)



# Posts
# Get all posts
@app.route("/api/posts/")
def posts():
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    posts = Post.query.all()
    posts_data = []

    for post in posts:
        post_data = row2dict(post)
        likes_count = len(post.likes) if post.likes else 0
        comments_count = len(post.comments) if post.comments else 0
        post_data["likes"] = likes_count
        post_data["comments"] = comments_count
        posts_data.append(post_data)
    
    return jsonify(posts_data)


# Get all posts by followed users
@app.route("/api/posts/homepage/")
def posts_homepage():
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    user_id = session.get("user_id")
    followed_users = Follower.query.filter_by(following_id=user_id).all()
    followed_usersId = [str(user.followed_id) for user in followed_users]
    posts = Post.query.filter(Post.user_id.in_(followed_usersId)).all()
    posts_data = []

    for post in posts:
        post_data = row2dict(post)
        likes_count = len(post.likes) if post.likes else 0
        comments_count = len(post.comments) if post.comments else 0
        post_data["likes"] = likes_count
        post_data["comments"] = comments_count
        posts_data.append(post_data)
    
    return jsonify(posts_data)

# Create Post
@app.route("/api/posts/post/", methods=["POST"])
def posts_post():
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    content = request.json["content"]
    caption = request.json["caption"]
    user_id = session.get('user_id')

    user = User.query.filter_by(user_id=user_id).first()
    username = user.username
    profile_photo = user.profile_photo
    post = Post(content=content, caption=caption, user_id=user_id, username=username, profile_photo=profile_photo)    

    db.session.add(post)
    db.session.commit()

    post_data = {
        "caption": post.caption,
        "content": post.content,
        "post_id": post.id,
        "user_id": post.user_id,
        "username": user.username,
        "profile_photo": user.profile_photo,
        "likes": 0,
        "comments": 0,
        "timestamp": post.timestamp
    }
    
    return jsonify(post_data)


# Search Post
@app.route("/api/posts/search/<string:query>/")
def posts_search(query):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    posts = Post.query.filter(Post.caption.like(f'%{query}%')).all()
    posts_data = []

    for post in posts:
        post_data = row2dict(post)
        likes_count = len(post.likes) if post.likes else 0
        comments_count = len(post.comments) if post.comments else 0
        post_data["likes"] = likes_count
        post_data["comments"] = comments_count
        posts_data.append(post_data)
    
    return jsonify(posts_data)


# Get post data
@app.route("/api/posts/<string:post_id>/")
def posts_get(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404
    
    post_data = row2dict(post)
    likes_count = len(post.likes) if post.likes else 0
    comments_count = len(post.comments) if post.comments else 0
    post_data["likes"] = likes_count
    post_data["comments"] = comments_count
    
    return jsonify(post_data)


# Post Update
@app.route('/api/posts/<string:post_id>/update/', methods=["PUT"])
def post_update(post_id):
    caption = request.json["caption"]

    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get("user_id")

    if post.user_id != user_id:
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409
    
    
    post.caption = caption

    db.session.commit()

    post_data = row2dict(post)
    likes_count = len(post.likes) if post.likes else 0
    comments_count = len(post.comments) if post.comments else 0
    post_data["likes"] = likes_count
    post_data["comments"] = comments_count
    
    return jsonify(post_data)
        

# Post Delete
@app.route("/api/posts/<string:post_id>/delete/", methods=["DELETE"])
def posts_delete(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')

    if post.user_id != user_id:
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409

    db.session.delete(post)
    db.session.commit()
    
    return jsonify({"message": "Post berhasil di delete!"})


# Get post comments
@app.route("/api/posts/<string:post_id>/comments/")
def posts_get_comments(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    comments_data = []
    for comment in post.comments:
        comments_data.append({
            "comment_id": comment.id,
            "username": comment.username,
            "profile_photo": comment.profile_photo,
            "post_id": comment.post_id,
            "user_id": comment.user_id,
            "content": comment.content,
            "timestamp": comment.timestamp,
            "likes": len(comment.likes) if comment.likes else 0
        })
    
    return jsonify(comments_data)

# Get post likes
@app.route("/api/posts/<string:post_id>/likes/")
def posts_get_likes(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    likes_data = []
    for like in post.likes:
        likes_data.append({
            "like_id": like.id,
            "post_id": like.post_id,
            "user_id": like.user_id
        })
    
    return jsonify(likes_data)

# Get post saves
@app.route("/api/posts/<string:post_id>/saves/")
def posts_get_saves(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    saves_data = []
    for save in post.saves:
        saves_data.append({
            "save_id": save.id,
            "post_id": save.post_id,
            "user_id": save.user_id
        })
    
    return jsonify(saves_data)

# Comment Post
@app.route("/api/posts/<string:post_id>/comment/", methods=["POST"])
def posts_comment(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    content = request.json["content"]
    user_id = session.get('user_id')

    post = Post.query.filter_by(id=post_id).first()
    user = User.query.filter_by(user_id=user_id).first()
    profile_photo = user.profile_photo
    username = user.username

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    comment = Comment(profile_photo=profile_photo, username=username, content=content, post_id=post_id, user_id=user_id)

    db.session.add(comment)
    db.session.commit()

    comment_data = row2dict(comment)

    if user_id != post.user_id:
        notification = Notif(username=username, profile_photo=profile_photo, subject_id=user_id, target_id=post.user_id, action="comment", post_id=post.id, comment_id=comment.id)
        db.session.add(notification)
        db.session.commit()
    
    return jsonify(comment_data)


# Like Status Post
@app.route("/api/posts/<string:post_id>/likestatus/")
def posts_likestatus(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    liked = PostLike.query.filter_by(**{"post_id":post_id, "user_id":user_id}).first()

    if liked is not None:
        return jsonify({
            "like": True
        })
    else:
        return jsonify({
            "like": False
        })

# Like Post
@app.route("/api/posts/<string:post_id>/like/", methods=["POST"])
def posts_like(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    liked = PostLike.query.filter_by(**{"post_id":post_id, "user_id":user_id}).first()

    if liked is not None:
        return jsonify({
            "message": "Sudah di like!"
        })


    like = PostLike(post_id=post_id, user_id=user_id, content=post.content)
    user = User.query.filter_by(user_id=user_id).first()
    profile_photo = user.profile_photo
    username = user.username

    db.session.add(like)
    db.session.commit()

    like_data = row2dict(like)

    if user_id != post.user_id:
        notification = Notif(username=username, profile_photo=profile_photo, subject_id=user_id, target_id=post.user_id, action="like_post", post_id=post.id, comment_id=None)
        
        db.session.add(notification)
        db.session.commit()

    return jsonify(like_data)

# UnLike Post
@app.route("/api/posts/<string:post_id>/unlike/", methods=["POST"])
def posts_unlike(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    liked = PostLike.query.filter_by(**{"post_id":post_id, "user_id":user_id}).first()

    if not liked:
        return jsonify({
            "message": "Sudah di unlike!"
        })

    db.session.delete(liked)
    db.session.commit()
    
    return jsonify({"message": "Berhasil unlike!"})


# Save Status Post
@app.route("/api/posts/<string:post_id>/savestatus/")
def posts_savestatus(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    saved = PostSave.query.filter_by(**{"post_id":post_id, "user_id":user_id}).first()

    if saved is not None:
        return jsonify({
            "save": True
        })
    else:
        return jsonify({
            "save": False
        })

# Save Post
@app.route("/api/posts/<string:post_id>/save/", methods=["POST"])
def posts_save(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    saved = PostSave.query.filter_by(**{"post_id":post_id, "user_id":user_id}).first()

    if saved is not None:
        return jsonify({
            "message": "Sudah di save!"
        })


    save = PostSave(post_id=post_id, user_id=user_id, content=post.content)
    user = User.query.filter_by(user_id=user_id).first()
    profile_photo = user.profile_photo
    username = user.username

    db.session.add(save)
    db.session.commit()

    save_data = row2dict(save)

    if user_id != post.user_id:
        notification = Notif(username=username, profile_photo=profile_photo, subject_id=user_id, target_id=post.user_id, action="save_post", post_id=post.id, comment_id=None)
        
        db.session.add(notification)
        db.session.commit()
    
    return jsonify(save_data)

# Unsave Post
@app.route("/api/posts/<string:post_id>/unsave/", methods=["POST"])
def posts_unsave(post_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    post = Post.query.filter_by(id=post_id).first()

    if post is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    saved = PostSave.query.filter_by(**{"post_id":post_id, "user_id":user_id}).first()

    if not saved:
        return jsonify({
            "message": "Sudah di unsave!"
        })

    db.session.delete(saved)
    db.session.commit()
    
    return jsonify({"message": "Berhasil unsave!"})


# Comments

# Comment Delete
@app.route("/api/comments/<string:comment_id>/delete/", methods=["DELETE"])
def comments_delete(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')

    if comment.user_id != user_id:
        return jsonify({
            "error": "Kredensial akun salah!"
        }), 409

    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({"message": "Comment berhasil di delete!"})

# Like Status Comment
@app.route("/api/comments/<string:comment_id>/likestatus/")
def comments_likestatus(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    liked = CommentLike.query.filter_by(**{"comment_id":comment_id, "user_id":user_id}).first()

    if liked is not None:
        return jsonify({
            "like": True
        })
    else:
        return jsonify({
            "like": False
        })

# Like Comment
@app.route("/api/comments/<string:comment_id>/like/", methods=["POST"])
def comments_like(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    liked = CommentLike.query.filter_by(**{"comment_id":comment_id, "user_id":user_id}).first()

    if liked is not None:
        return jsonify({
            "message": "Sudah di like!"
        })


    like = CommentLike(comment_id=comment_id, user_id=user_id, username=comment.username, profile_photo=comment.profile_photo, content=comment.content)
    user = User.query.filter_by(user_id=user_id).first()
    profile_photo = user.profile_photo
    username = user.username

    db.session.add(like)
    db.session.commit()

    like_data = row2dict(like)

    if user_id != comment.user_id:
        notification = Notif(username=username, profile_photo=profile_photo, subject_id=user_id, target_id=comment.user_id, action="like_comment", post_id=comment.post.id, comment_id=comment.id)
        
        db.session.add(notification)
        db.session.commit()
    
    return jsonify(like_data)

# UnLike Comment
@app.route("/api/comments/<string:comment_id>/unlike/", methods=["POST"])
def comments_unlike(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    liked = CommentLike.query.filter_by(**{"comment_id":comment_id, "user_id":user_id}).first()

    if not liked:
        return jsonify({
            "message": "Sudah di unlike!"
        })

    db.session.delete(liked)
    db.session.commit()
    
    return jsonify({"message": "Berhasil unlike!"})

# Get comment likes
@app.route("/api/comments/<string:comment_id>/likes/")
def comments_get_likes(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    likes_data = []
    for like in comment.likes:
        likes_data.append({
            "like_id": like.id,
            "comment_id": like.comment_id,
            "user_id": like.user_id
        })
    
    return jsonify(likes_data)


# Save Status Comment
@app.route("/api/comments/<string:comment_id>/savestatus/")
def comments_savestatus(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    saved = CommentSave.query.filter_by(**{"comment_id":comment_id, "user_id":user_id}).first()

    if saved is not None:
        return jsonify({
            "save": True
        })
    else:
        return jsonify({
            "save": False
        })


# Save Comment
@app.route("/api/comments/<string:comment_id>/save/", methods=["POST"])
def comments_save(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    saved = CommentSave.query.filter_by(**{"comment_id":comment_id, "user_id":user_id}).first()

    if saved is not None:
        return jsonify({
            "message": "Sudah di save!"
        })


    save = CommentSave(comment_id=comment_id, user_id=user_id, username=comment.username, profile_photo=comment.profile_photo, content=comment.content)
    user = User.query.filter_by(user_id=user_id).first()
    profile_photo = user.profile_photo
    username = user.username

    db.session.add(save)
    db.session.commit()

    save_data = row2dict(save)

    if user_id != comment.user_id:
        notification = Notif(username=username, profile_photo=profile_photo, subject_id=user_id, target_id=comment.user_id, action="save_comment", post_id=comment.post.id, comment_id=comment.id)
        
        db.session.add(notification)
        db.session.commit()
    
    return jsonify(save_data)

# Unsave Comment
@app.route("/api/comments/<string:comment_id>/unsave/", methods=["POST"])
def comments_unsave(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    user_id = session.get('user_id')
    saved = CommentSave.query.filter_by(**{"comment_id":comment_id, "user_id":user_id}).first()

    if not saved:
        return jsonify({
            "message": "Sudah di unsave!"
        })

    db.session.delete(saved)
    db.session.commit()
    
    return jsonify({"message": "Berhasil unlike!"})

# Get comment saves
@app.route("/api/comments/<string:comment_id>/saves/")
def comments_get_saves(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    saves_data = []
    for save in comment.saves:
        saves_data.append({
            "save_id": save.id,
            "comment_id": save.comment_id,
            "user_id": save.user_id
        })
    
    return jsonify(saves_data)

# Get comment data
@app.route("/api/comments/<string:comment_id>/")
def comments_get(comment_id):
    if not isUserLogged():
        return jsonify({
            "message": "Anda belum login!"
        }), 401
    
    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({
            "error": "tidak ditemukan"
        }), 404

    comment_data = row2dict(comment)
    comment_data["likes"] = len(comment.likes) if comment.likes else 0
    
    return jsonify(comment_data)


if __name__ == "__main__":
    app.run(debug=True)