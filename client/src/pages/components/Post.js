import React, {useState} from "react"
import axios from "axios"
import LikeButton from "./LikeButton"
import SaveButton from "./SaveButton"
import CommentsButton from "./CommentsButton"


const Post = (props) => {
    const [likes, setLikes] = useState(props.likes)
    const [editCaption, setEditCaption] = useState(false)
    const [caption, setCaption] = useState(props.caption)
    const my_user_id = localStorage.getItem("my_user_id")
    const user_id = props.user_id
    const cancelUpdate = () => {
      setEditCaption(!editCaption)
    }
    const updateCaption = (e) => {
        e.preventDefault()
        axios.put(`http://localhost:5000/api/posts/${props.id}/update/`, {
          "caption": caption
        }, {withCredentials: true})
          .then(res => {
              setEditCaption(!editCaption)
          })
          .catch(err => {
            console.log(err)
            setEditCaption(!editCaption)
          })
    }
    const handleLikeCountUpdate = (newLikeCount) => {
        setLikes(newLikeCount)
    }
    const handleChange = (event) => {
        if(event.target.name === "caption"){
          setCaption(event.target.value)
        }
    }
    return (
        <div className="card post mb-4 mx-auto">
      <div className="card-body">
        {props.content && (
          <div>
            {props.content.includes('.jpg') || props.content.includes('.png') ? (
              <img src={props.content} className="content img-fluid" alt="Post" width="300px" />
            ) : (
              <video controls width="300px" className="content">
                <source src={props.content} type="video/mp4" />
                Browser anda tidak support tag video
              </video>
            )}
          </div>
        )}

        <div className="row mt-2">
            <div className="col-8">
                <div className="d-flex align-items-center">
                <LikeButton post_id={props.id} likeCount={likes} onLikeCountUpdate={handleLikeCountUpdate} type="posts" />
                <CommentsButton post_id={props.id}/>
                </div>
                { likes } menyukai
            </div>
            <div className="col-4 justify-content-end d-flex editSave">

<svg xmlns="http://www.w3.org/2000/svg" className="mt-1" viewBox="0 0 64 64" onClick={() => setEditCaption(!editCaption)} width="26" height="26" style={{
  "display": (user_id === my_user_id) ? "inline-block" : "none"
}}><path fill="#222" d="M8.69 59.53a4.21 4.21 0 0 1-4.17-4.88l1.77-11.18a4.14 4.14 0 0 1 1.18-2.32l34.8-34.8a6.45 6.45 0 0 1 9.1 0l6.28 6.28a6.45 6.45 0 0 1 0 9.1l-34.8 34.8a4.14 4.14 0 0 1-2.32 1.18L9.35 59.48a4.89 4.89 0 0 1-.66.05Zm11.52-3.79ZM46.82 8.47a2.44 2.44 0 0 0-1.73.71L10.3 44a.17.17 0 0 0-.06.12L8.47 55.28a.22.22 0 0 0 .25.25l11.18-1.77a.17.17 0 0 0 .1-.06l34.8-34.79a2.44 2.44 0 0 0 0-3.45l-6.26-6.28a2.41 2.41 0 0 0-1.72-.71Z"/><path fill="#222" d="M53.88 24.67a2 2 0 0 1-1.42-.58L39.91 11.54a2 2 0 0 1 2.83-2.83l12.55 12.55a2 2 0 0 1 0 2.83 2 2 0 0 1-1.41.58zM21.71 56.84a2 2 0 0 1-1.41-.58L7.74 43.7a2 2 0 0 1 2.83-2.82l12.56 12.55a2 2 0 0 1-1.42 3.41z"/><path fill="#222" d="M15.43 50.57A2 2 0 0 1 14 47.15L46.19 15A2 2 0 1 1 49 17.81L16.85 50a2 2 0 0 1-1.42.57Z"/></svg>


              <SaveButton post_id={props.id} type="posts" />
            </div>
            </div>

            <div>
            <span className="fw-bold username" onClick={() => window.location.href=`/user/${props.user_id}/`}>@{props.username}</span> {editCaption ? (
              <form>
                <textarea className="captionEdit mt-1"
                onChange={handleChange}
                name="caption"
                  rows="10%"
                  width="100%"
                  value={caption}
                  placeholder="Caption"
                />
                <br/>
                <div className="d-flex justify-content-between btnEdit my-2">
                  <button type="submit" className="btn btn-primary update" onClick={updateCaption}>Update</button>
                  <button  className="btn btn-primary cancel" onClick={cancelUpdate}>Cancel</button>
                </div>
                
              </form>
            ) : caption}
            </div>
            <div onClick={() => window.location.href = `/post/${props.id}/comments/`} className="lihatKomen">Lihat semua {props.comments} komentar</div>
        </div>
        </div>

    )
}

export default Post