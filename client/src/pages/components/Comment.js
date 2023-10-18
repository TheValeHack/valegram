import React, {useState} from "react"
import LikeButton from "./LikeButton"
import SaveButton from "./SaveButton"

const Comment = (props) => {
    const [likes, setLikes] = useState(props.likes)

    const handleLikeCountUpdate = (newLikeCount) => {
        setLikes(newLikeCount)
    }
    return (
        <div>
            <br/>
           <div className="comment-wrap">
            <div className="container d-flex justify-content-between">
                <div class="d-flex">
                <div className="">
                 <img src={props.profile_photo} width="50px" height="50px" style={{"borderRadius":"50%"}} />
                </div>
                <div className="content-text ml-3">
                    <div className="text-align-left"><span className="fw-bold username" onClick={() => window.location.href=`/user/${props.user_id}/`}>@{props.username}</span></div>
                    <div>{props.content} aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
                </div>
                </div>
             <div className="d-flex">
                <LikeButton post_id={props.id} likeCount={likes} onLikeCountUpdate={handleLikeCountUpdate} type="comments" />
                <SaveButton post_id={props.id} type="comments" />
             </div>
            </div>
           </div>
           
        </div>
    )
}

export default Comment