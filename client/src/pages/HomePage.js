import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate } from 'react-router-dom'
import Post from './components/Post'
import Navbar from "./components/Navbar"

function HomePage() {
  const [logged, setLogged] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts/", {
      withCredentials: true
    })
    .then(res => {
      const receivedPosts = res.data
      setLogged(true)
      setPosts(receivedPosts)
    })
    .catch(error => {
      setLogged(false)
      setPosts([])
    })

    return () => {
      setPosts([])
    }
  }, [])

  return (
    <div>
      {logged === true ? (
        <div>
          {posts.map(item => (
            <Post
              key={item.id}
              id={item.id}
              username={item.username}
              profile_photo={item.profile_photo}
              user_id={item.user_id}
              content={item.content}
              caption={item.caption}
              likes={item.likes}
              comments={item.comments}
              timestamp={item.timestamp}
            />
          ))}
        </div>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
      <Navbar />
    </div>
  )
}

export default HomePage
