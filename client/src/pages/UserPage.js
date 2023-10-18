import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate, useParams } from "react-router-dom"
import FollowButton from "./components/FollowButton"
import MiniPost from "./components/MiniPost"

const UserPage = () => {
  const [userData, setUserData] = useState({})
  const [logged, setLogged] = useState(true)
  const [followers, setFollowers] = useState([])
  const [followings, setFollowings] = useState([])
  const [posts, setPosts] = useState([])
  const { user_id } = useParams()

  const getFollowers = () => {
    axios
      .get(`http://localhost:5000/api/users/${user_id}/followers`, { withCredentials: true })
      .then((res) => {
        setFollowers(res.data)
      })
      .catch((error) => console.log(error))
  }

  const getFollowings = () => {
    axios
      .get(`http://localhost:5000/api/users/${user_id}/followings`, { withCredentials: true })
      .then((res) => {
        setFollowings(res.data)
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    let my_user_id = localStorage.getItem("my_user_id")

    if (user_id === my_user_id) {
      window.location.href = "/profile"
    } else {
      axios
        .get(`http://localhost:5000/api/users/${user_id}/`, {
          withCredentials: true,
        })
        .then((res) => {
          const user = res.data
          setLogged(true)
          setUserData(user)

          axios
            .get(`http://localhost:5000/api/users/${user_id}/posts/`, {
              withCredentials: true,
            })
            .then((res) => {
              setPosts(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setLogged(false)
            }
          }
        })
          getFollowers()
          getFollowings()
    }

    return () => {
      setUserData({})
    }
  }, [user_id])

  return (
    <div>
      {logged ? (
        JSON.stringify(userData) === "{}" ? (
          <p>Not found</p>
        ) : (
          <div className="container py-4 ">
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={userData.profile_photo}
                  alt="Profile Picture"
                  className="rounded-circle img-fluid"
                />
              </div>
              <div className="col-md-8">
                <div className="d-flex justify-content-between ">
                  <div>
                    <h2>{userData.username}</h2>
                  </div>
                  <div>
                    <strong>{posts.length}</strong> posts
                  </div>
                  <div>
                    <strong>{followers.length}</strong> followers
                  </div>
                  <div>
                    <strong>{followings.length}</strong> following
                  </div>
                </div>
                <FollowButton user_id={userData.user_id} />
                <h5>{userData.full_name}</h5>
                <p>{userData.bio}</p>
              </div>
            </div>
          </div>
        )
      ) : (
        <Navigate to="/login" replace={true} />
      )}
      <div className="row">
        {posts.map((item) => (
          <MiniPost
            key={item.id}
            post_id={item.id}
            content={item.content}
            timestamp={item.timestamp}
          />
        ))}
      </div>
    </div>
  )
}

export default UserPage