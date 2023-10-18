import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate } from "react-router-dom"
import Notification from "./components/Notification"
import Navbar from "./components/Navbar"

const NotificationPage = () => {
  const [notificationData, setNotificationData] = useState([])
  const [logged, setLogged] = useState(true)

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/mynotifications/`, {
        withCredentials: true,
      })
      .then((res) => {
        const notifs = res.data
        setLogged(true) 
        setNotificationData(notifs)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setLogged(false) 
          }
        }
        console.log(error)
      })
  }, []) 

  return (
    <div>
      {logged ? (
        notificationData.length === 0 ? ( 
          <p>Tidak ada notif</p>
        ) : (
          <div>
            {notificationData.map((item) => (
              <Notification
                key={item.id}
                id={item.id}
                action={item.action}
                username={item.username}
                profile_photo={item.profile_photo}
                subject_id={item.subject_id}
                target_id={item.target_id}
                comment_id={item.comment_id}
                post_id={item.post_id}
                timestamp={item.timestamp}
              />
            ))}
          </div>
        )
      ) : (
        <Navigate to="/login" replace={true} />
      )}
      <Navbar />
    </div>
  )
}

export default NotificationPage

