import React, { useState, useEffect } from "react"
import axios from "axios"

const FollowButton = (props) => {
    const user_id = props.user_id
    const [followStatus, setFollowStatus]  = useState(false)
    const followUser = () => {
        axios
        .post(
            `http://localhost:5000/api/users/${user_id}/${
            followStatus ? "unfollow" : "follow"
            }/`,
            {},
            {
            withCredentials: true,
            }
        )
        .then((res) => {
            setFollowStatus(!followStatus)
        })
        .catch((error) => {
            console.log(error)
        })
    }


    useEffect(() => {
        axios
        .get(`http://localhost:5000/api/users/${user_id}/followstatus/`, {
            withCredentials: true,
        })
        .then((res) => {
            const status = res.data.follow
            setFollowStatus(status)
        })
        .catch((error) => {
            console.log(error)
        })
    },  [user_id])

    return (
        <div
        onClick={followUser} 
        style={{
            "padding": "10px",
            "color":"white",
            "width": "60px",
            "border": "1px solid black",
            "background": (followStatus ? "grey" : "blue")
        }}>{ followStatus ? "Unfollow" : "Follow" }</div>
    )
}

export default FollowButton