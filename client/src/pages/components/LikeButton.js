
import React, { useState, useEffect } from "react"
import axios from "axios"

const LikeButton = (props) => {
  const [likeStatus, setLikeStatus] = useState(false)
  const post_id = props.post_id
  const likeCount = props.likeCount
  const type = props.type
  const updateLikeCount = (newLikeCount) => {
    props.onLikeCountUpdate(newLikeCount)
  };

  const likePost = () => {
    axios
      .post(
        `http://localhost:5000/api/${type}/${post_id}/${
          likeStatus ? "unlike" : "like"
        }/`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setLikeStatus(!likeStatus)
        updateLikeCount(likeStatus ? likeCount - 1: likeCount +1)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/${type}/${post_id}/likestatus/`, {
        withCredentials: true,
      })
      .then((res) => {
        const status = res.data.like
        setLikeStatus(status)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [post_id, type])

  return (
    <div className="likeButton">
      {likeStatus ? (
        <svg onClick={likePost} xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#ff5855" d="M11.863 6.508c-3.517 0-6.368 2.437-6.368 6.872 0 4.434 5.944 8.704 11.039 13.286C21.629 22.084 27.6 17.869 27.6 13.38c0-4.489-2.852-6.872-6.369-6.872-1.855 0-3.533 1.384-4.697 2.749-1.163-1.357-2.823-2.75-4.67-2.75z"/><path fill="#ff7a6c" d="M21.025 6.52c-.296 0-.594.061-.88.126 2.963.473 4.373 2.742 4.373 6.725 0 4.197-4.37 8.143-9.213 12.383.34.3.67.58 1.006.88 5.094-4.58 11.063-8.773 11.063-13.263 0-4.488-2.832-6.851-6.349-6.851z"/><path fill="#d94c4a" d="M11.947 6.608c.296 0 .594.061.88.126-2.964.473-4.175 2.743-4.175 6.726 0 4.197 3.626 8.788 8.468 13.029-.34.298-.124-.067-.46.234C11.567 22.14 5.599 17.949 5.599 13.46c0-4.489 2.831-6.852 6.349-6.852z"/><path fill="none" stroke="#560f65" strokeLinecap="round" strokeLinejoin="round" d="M11.863 6.508c-3.517 0-6.368 2.437-6.368 6.872 0 4.434 5.944 8.704 11.039 13.286C21.629 22.084 27.6 17.869 27.6 13.38c0-4.489-2.852-6.872-6.369-6.872-1.855 0-3.533 1.384-4.697 2.749-1.163-1.357-2.823-2.75-4.67-2.75z" strokeWidth="1.00001"/><path fill="none" stroke="#f2f0e7" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".9998479199999999" d="M24.93 13.84c-.013-2.495-1.284-4.254-3.17-5.086"/></svg>
      ) : (
        <svg onClick={likePost} className="unliked" xmlns="http://www.w3.org/2000/svg" width="28" height="28" data-name="Layer 1" viewBox="0 0 24 24"><path d="M16.24 3A6 6 0 0 0 12 4.76a6 6 0 1 0-8.49 8.48L12 21.73l8.49-8.49A6 6 0 0 0 16.24 3Zm2.83 8.83L12 18.9l-7.07-7.07a4 4 0 1 1 5.66-5.66L12 7.59l1.41-1.41a4.1 4.1 0 0 1 5.66 0 4 4 0 0 1 0 5.66Z"/></svg>
      )}
    </div>
  )
}

export default LikeButton
