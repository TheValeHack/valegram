import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate } from "react-router-dom"
import { storage } from "./../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

const UpdateProfilePage = () => {
  const [profileData, setProfileData] = useState({})
  const [logged, setLogged] = useState(true)
  const [message, setMessage] = useState("")
  const [content, setContent] = useState(null)

  const clearFileInput = () => {
    const fileInput = document.getElementById("profile_photo")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleContentChange = (e) => {
    const selectedContent = e.target.files[0]
    if (selectedContent.type.startsWith("image/")) {
      if (selectedContent) {
        setContent(selectedContent)
      }
    } else {
      setContent(null)
      clearFileInput()
      alert("Hanya bisa mengupload gambar!")
    }
  }

  const changeData = (event) => {
    const { name, value } = event.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  const sendData = (e) => {
    e.preventDefault()
    const contentRef = ref(storage, `contents/${v4() + content.name}`)
    uploadBytes(contentRef, content).then(() => {
      getDownloadURL(contentRef).then((url) => {
        let updateData = { ...profileData }
        updateData["profile_photo"] = url ? url : ""
        axios
          .put("http://localhost:5000/update/", updateData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.status === 200) {
              setMessage("Update berhasil!")
              setInterval(() => {
                window.location.href = "/profile"
              }, 1000)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      })
    })
  }

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/mydata/`, {
        withCredentials: true,
      })
      .then((res) => {
        const profile = res.data
        setLogged(true)
        setProfileData(profile)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setLogged(false)
          }
        }
      })

    return () => {
      setProfileData({})
    }
  }, [])

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <h1 className="text-center mb-4">Update Profile</h1>

        <div className="mb-3">
          <label htmlFor="profile_photo" className="form-label">
            Profile Image
          </label>
          <input
            type="file"
            className="form-control-file"
            id="profile_photo"
            accept="image/*"
            name="profile_photo"
            onChange={handleContentChange}
          />
          {content && (
            <img
              src={URL.createObjectURL(content)}
              alt="Profile Preview"
              className="img-thumbnail mt-2 rounded-circle"
              width="100"
              height="100"
            />
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            name="username"
            value={profileData.username}
            onChange={changeData}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="full_name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="full_name"
            placeholder="Full Name"
            name="full_name"
            value={profileData.full_name}
            onChange={changeData}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <textarea
            className="form-control"
            id="bio"
            rows="3"
            placeholder="Bio"
            name="bio"
            value={profileData.bio}
            onChange={changeData}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          type="submit"
          onClick={sendData}
        >
          Update Profile
        </button>
        {message && <p className="mt-3 text-success">{message}</p>}
      </div>
    </div>
  )
}

export default UpdateProfilePage
