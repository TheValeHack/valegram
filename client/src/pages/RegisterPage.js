import React, { useState, useEffect } from "react"
import axios from "axios"
import { Navigate } from "react-router-dom"
import { storage } from "./../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    bio: "",
    full_name: "",
  })
  const [content, setContent] = useState(null) 
  const [logged, setLogged] = useState(false)
  const [message, setMessage] = useState("")

  const clearFileInput = () => {
    const fileInput = document.getElementById('profile_photo')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleContentChange = (e) => {
    const selectedContent = e.target.files[0]
    if (selectedContent.type.startsWith('image/')) {
        if (selectedContent) {
            setContent(selectedContent)
        }
    } else {
        setContent(null)
        clearFileInput()
        alert('Hanya bisa mengupload gambar!')
    }
}

  const changeData = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const sendData = (e) => {
    if(formData.password != formData.confirmPassword){
      setMessage("Password dan Konfirmasi password tidak sama!")
      return
    }
    e.preventDefault()
    const contentRef = ref(storage, `contents/${v4() + content.name}`)
    uploadBytes(contentRef, content)
        .then(() => {
            getDownloadURL(contentRef)
                .then(url => {
                    let registerData = {...formData}
                    registerData["profile_photo"] = url ? url : ""
                    axios
                        .post("http://localhost:5000/register/", registerData, {
                            withCredentials: true,
                        })
                        .then((response) => {
                            window.location.href = "/login"
                            setMessage("Register berhasil!")
                            setInterval(() => {
                                window.location.href = "/login"
                            }, 1000)
                        })
                        .catch((error) => {
                            if (error.response) {
                            console.log(error.response)
                            console.log("server responded")
                            } else if (error.request) {
                            console.log("network error")
                            } else {
                            console.log(error)
                            }
                        })
                })
                    .catch(error => console.log(error))
        })
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/mydata/", {withCredentials: true})
      .then((res) => {
        let resp = res.data
        console.log(resp)
        setLogged(true)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          if(error.response.status === 401){
              setLogged(false)
          }
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log("Error", error.message)
        }
      })

      return (
        setLogged(false)
      )
  }, [])
  

  return (
    <form onSubmit={sendData}>
      <div style={{"paddingTop":"100px", "paddingBottom": "100px"}}>
        <div className="container d-flex justify-content-center align-items-center">
          <div className="card p-4">
            <h1 className="text-center mb-4">Register</h1>

            <div className="mb-3">
              <label htmlFor="profileImage" className="form-label">
                Profile Image
              </label>
              <input
                type="file"
                className="form-control-file"
                id="profileImage"
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
                value={formData.username}
                onChange={changeData}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={changeData}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={changeData}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={changeData}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Full Name"
                name="full_name"
                value={formData.full_name}
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
                value={formData.bio}
                onChange={changeData}
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              onClick={sendData}
              disabled={!content || !formData.username || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
            >
              Register
            </button>
            { message.length > 0 ? (
                <div className={`alert ${message === "Login berhasil!" ? "alert-success" : "alert-danger"}`} role="alert">
                {message}
              </div>              
            ) : "" }
          </div>
        </div>
      </div>
    </form>
  )
}

export default RegisterPage
