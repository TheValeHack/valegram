import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate } from "react-router-dom"
import MiniPost from "./components/MiniPost"
import Navbar from "./components/Navbar"

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({})
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [followings, setFollowings] = useState([])
  const [logged, setLogged] = useState(true)
  const user_id = localStorage.getItem("my_user_id")
  const getFollowers = () => {
    axios.get(`http://localhost:5000/api/users/${user_id}/followers`, {withCredentials: true})
      .then(res => {
          setFollowers(res.data)
      })
      .catch(error => console.log(error))
  }
  const getFollowings = () => {
    axios.get(`http://localhost:5000/api/users/${user_id}/followings`, {withCredentials: true})
      .then(res => {
          setFollowings(res.data)
      })
      .catch(error => console.log(error))
  }
  const toUpdate = () => {
    window.location.href = "/updateProfile/"
  }

  useEffect(() => {
    getFollowers()
    getFollowings()
    axios
      .get(`http://localhost:5000/api/users/mydata/`, {
        withCredentials: true
      })
      .then((res) => {
        const profile = res.data
        setLogged(true)
        setProfileData(profile)
        axios.get(`http://localhost:5000/api/users/${profile.user_id}/posts/`, {
            withCredentials: true
        })
            .then(res => {
                setPosts(res.data)
            }).catch(error => {
                console.log(error)
            })
      })
      .catch((error) => {
        if(error.response){
            if(error.response.status === 401){
                setLogged(false)
            }
        }
    })

    return () => {
      setProfileData({})
    }
  }, [])

  return (
    <div>
      {logged ? (
        JSON.stringify(profileData) === "{}" ? (
          <p>Not found</p>
        ) : (
          <div className="container py-4 ">
          <div className="row">
            <div className="col-md-4 text-center">
              <img
                src={profileData.profile_photo}
                alt="Profile Picture"
                className="rounded-circle img-fluid"
              />
            </div>
            <div className="col-md-8">
              <div className="d-flex justify-content-between ">
                <div>
                  <h2>{profileData.username}</h2>
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
              <button className="btn btn-secondary" onClick={toUpdate}>Edit profile</button>
              <div className="d-flex">
              <button className="btn btn-secondary" onClick={() => window.location.href="/liked"}>Disukai</button>
              <button className="btn btn-secondary" onClick={() => window.location.href="/saved"}>Disimpan</button>
              </div>
              
              <h5>{profileData.full_name}</h5>
              <p>{profileData.bio}</p>
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
      <Navbar />
    </div>
  )
}

export default ProfilePage