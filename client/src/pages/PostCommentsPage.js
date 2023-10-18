import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate, useParams } from "react-router-dom"
import Comment from "./components/Comment"

const PostCommentsPage = () => {
    const { post_id } = useParams()
    const [commentData, setCommentData] = useState([])
    const [content, setContent] = useState("")
    const [logged, setLogged] = useState(true)
    const handleContentChange = (e) => {
        setContent(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:5000/api/posts/${post_id}/comment/`, {
            "content": content
        }, {
            withCredentials: true
        })
            .then(res => {
                setContent("")
                window.location.href = `/post/${post_id}/comments`
            })
            .catch(error => console.log(error))
    }
    
    useEffect(() => {
        axios
        .get(`http://localhost:5000/api/posts/${post_id}/comments/`, {
            withCredentials: true
        })
        .then((res) => {
            const comments = res.data
            setLogged(true)
            setCommentData(comments)
            console.log(commentData)
        })
        .catch((error) => {
            if (error.response) {
            if (error.response.status === 401) {
                setLogged(false)
            }
            }
        })

        return () => {
        setCommentData([])
        }
    }, [post_id])

    return (
        <div>
        <div className="card comments">
            <div className="card-body">
            {logged ? (
                commentData.length === 0 ? (
                <p>Belum ada komen</p>
                ) : (
                <div>
                    {commentData.map(comment => (
                        <Comment
                        key={comment.comment_id}
                        id={comment.comment_id}
                        post_id={comment.post_id}
                        user_id={comment.user_id}
                        username={comment.username}
                        profile_photo={comment.profile_photo}
                        content={comment.content}
                        likes={comment.likes}
                        timestamp={comment.timestamp}
                    />
                    ))}
                </div>
                )
            ) : (
                <Navigate to="/login" replace={true} />
            )}
            </div>
            
        </div>
        
        <br/><br/>
        <form onSubmit={handleSubmit} className="d-flex submitComment justify-content-between">
            <input name="content" value={content} className="commentForm" id="content" placeholder="Comment..." onChange={handleContentChange}/>
            <button type="submit" className="commentBtn"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" enable-background="new 0 0 64 64" viewBox="0 0 64 64" fill="white"><polygon points="20.9 30.6 21.7 56.4 64 9.5"/><polygon points="0 11.2 20.1 28.7 63.3 7.6"/></svg></button>
        </form>
        </div>
    )
}

export default PostCommentsPage
