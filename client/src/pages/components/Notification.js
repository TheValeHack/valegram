import React from "react"

const Notification = (props) => {
    const notifMessage = () => {
        let msg = {
            "comment": "mengomentari postingan anda",
            "like_post": "menyukai postingan anda",
            "save_post": "menyimpan postingan anda",
            "like_comment": "menyukai comment anda",
            "save_comment": "menyimpan comment anda",
            "follow": "memfollow akun anda"
        }
        return props.username + " " + msg[props.action]
    }
    const notifUrl = () => {
        if((props.action === "like_post") || (props.action === "save_post")){
            return `/post/${props.post_id}/`
        } else if((props.action === "like_comment") || (props.action === "save_comment") || (props.action === "comment")){
            return `/post/${props.post_id}/comments`
        } else {
            return `/user/${props.subject_id}/`
        }
    }
    const handleClick = (url) => {
        window.location.href = url
    }
    return (
        <div onClick={() => handleClick(notifUrl())}>
        <br/>

           <div className="col-4">
            <img src={props.profile_photo} width="50px" height="50px" style={{"borderRadius":"50%"}} />
           </div>
           <div className="col-8 ">
               {notifMessage()}
           </div>
        </div>
    )
}

export default Notification