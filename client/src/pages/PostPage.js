import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate, useParams } from "react-router-dom"
import Post from "./components/Post"

const PostPage = () => {
  const { post_id } = useParams()
  const [postData, setPostData] = useState({})
  const [logged, setLogged] = useState(true)

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${post_id}/`, {
        withCredentials: true
      })
      .then((res) => {
        const posts = res.data
        setLogged(true)
        setPostData(posts)
      })
      .catch((error) => {
        if(error.response){
            if(error.response.status === 401){
                setLogged(false)
            }
        }
    })

    return () => {
      setPostData({})
    }
  }, [post_id])

  return (
    <div>
      {logged ? (
        JSON.stringify(postData) === "{}" ? (
          <p>Not found</p>
        ) : (
          <div>
            <Post
              id={postData.id}
              user_id={postData.user_id}
              content={postData.content}
              username={postData.username}
              profile_photo={postData.profile_photo}
              caption={postData.caption}
              likes={postData.likes}
              comments={postData.comments}
              timestamp={postData.timestamp}
            />
          </div>
        )
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  )
}

export default PostPage
