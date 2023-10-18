# Valegram Documentation
## Overview
Valegram is a social media web-based app which functions similarly to Instagram. You can upload posts, either images or videos, commenting, following each other, and perform other actions that you regularly do in other social media.
Valegram created with Flask and ReactJS. 

## Setup and Run

Clone repository

` git clone https://github.com/TheValeHack/valegram `

Go to client folder

`cd client`

Install required client packages

`npm install`

Run client side server

`npm start`

Go to the server folder

`cd ../`

`cd flask-server`

Install required server packages

`pip install -r requirements.txt`

Run client side server

`python app.py`

Now you can access the app in http://localhost:3000/ or you can also perform the API directly to http://localhost:5000/


## API Documentation
<br>

### User Management
/register/ (POST)

**Description**: Register a new user.


/login/ (POST)

**Description**: Log in as a user.


/update/ (PUT)

**Description**: Update user information.


/logout/

**Description**: Log out the current user.


/delete/ (DELETE)

**Description**: Delete authenticated user account.
<br>
<br>

### User Information

/api/users/ (GET)

**Description**: Get a list of all users.


/api/users/mydata/ (GET)

**Description**: Get the authenticated user's data.


/api/users/mynotifications/ (GET)

**Description**: Get notifications for the authenticated user.


/api/users/<user_id>/follow/ (POST)

**Description**: Follow a user.


/api/users/<user_id>/unfollow/ (POST)

**Description**: Unfollow a user.


/api/users/search/<query>/ (GET)

**Description**: Search for users by a query.


/api/users/<user_id>/ (GET)

**Description**: Get user details.


/api/users/<user_id>/posts/ (GET)

**Description**: Get posts created by a user.


/api/users/<user_id>/followstatus/ (GET)

**Description**: Check follow status with a user.


/api/users/<user_id>/followings/ (GET)

**Description**: Get users followed by a user.


/api/users/<user_id>/followers/ (GET)

**Description**: Get users following a user.


/api/users/<user_id>/comments/ (GET)

**Description**: Get comments created by a user.


/api/users/<user_id>/postlikes/ (GET)

**Description**: Get posts liked by a user.


/api/users/<user_id>/commentlikes/ (GET)

**Description**: Get comments liked by a user.


/api/users/<user_id>/postsaves/ (GET)

**Description**: Get posts saved by a user.


/api/users/<user_id>/commentsaves/ (GET)

**Description**: Get comments saved by a user.
<br>
<br>


### Post Management


/api/posts/ (GET)

**Description**: Get a list of all posts.


/api/posts/homepage/ (GET)

**Description**: Get posts for the homepage.


/api/posts/post/ (POST)

**Description**: Create a new post.


/api/posts/search/<query>/ (GET)

**Description**: Search for posts by a query.


/api/posts/<post_id>/ (GET)

**Description**: Get post details.


/api/posts/<post_id>/update/ (PUT)

**Description**: Update a post.


/api/posts/<post_id>/delete/ (DELETE)

**Description**: Delete a post.


/api/posts/<post_id>/comments/ (GET)

**Description**: Get comments on a post.


/api/posts/<post_id>/likes/ (GET)

**Description**: Get likes on a post.


/api/posts/<post_id>/saves/ (GET)

**Description**: Get saves on a post.


/api/posts/<post_id>/comment/ (POST)

**Description**: Add a comment to a post.


/api/posts/<post_id>/likestatus/ (GET)

**Description**: Check like status on a post.


/api/posts/<post_id>/like/ (POST)

**Description**: Like a post.


/api/posts/<post_id>/unlike/ (POST)

**Description**: Unlike a post.


/api/posts/<post_id>/savestatus/ (GET)

**Description**: Check save status on a post.


/api/posts/<post_id>/save/ (POST)

**Description**: Save a post.


/api/posts/<post_id>/unsave/ (POST)

**Description**: Unsave a post.
<br>
<br>

### Comment Management


/api/comments/<comment_id>/delete/ (DELETE)

**Description**: Delete a comment.


/api/comments/<comment_id>/likestatus/ (GET)

**Description**: Check like status on a comment.

/api/comments/<comment_id>/like/ (POST)


**Description**: Like a comment.


/api/comments/<comment_id>/unlike/ (POST)

**Description**: Unlike a comment.


/api/comments/<comment_id>/likes/ (GET)

**Description**: Get likes on a comment.


/api/comments/<comment_id>/savestatus/ (GET)

**Description**: Check save status on a comment.

/api/comments/<comment_id>/save/ (POST)

**Description**: Save a comment.


/api/comments/<comment_id>/unsave/ (POST)

**Description**: Unsave a comment.


/api/comments/<comment_id>/saves/ (GET)

**Description**: Get saves on a comment.


/api/comments/<comment_id>/ (GET)


**Description**: Get comment details.
