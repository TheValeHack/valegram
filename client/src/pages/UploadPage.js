import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { storage } from './../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import Navbar from './components/Navbar'

const centerBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
}

const uploadFormStyle = {
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  background: '#fff',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
}

const UploadPage = () => {
  const [content, setContent] = useState(null)
  const [caption, setCaption] = useState('')
  const [logged, setLogged] = useState(true)
  const [message, setMessage] = useState('')

  const clearFileInput = () => {
    const fileInput = document.getElementById('contentUpload')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleContentChange = (e) => {
    const selectedContent = e.target.files[0]
    if (selectedContent.type.startsWith('image/') || selectedContent.type.startsWith('video/')) {
      if (selectedContent) {
        setContent(selectedContent)
      }
    } else {
      setContent(null)
      clearFileInput()
      alert('Hanya bisa mengupload gambar atau video!')
    }
  }

  const handleCaptionChange = (e) => {
    setCaption(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content == null) {
      setMessage('Harus mengupload gambar atau video!')
      return
    }
    const contentRef = ref(storage, `contents/${v4() + content.name}`)
    uploadBytes(contentRef, content)
      .then(() => {
        getDownloadURL(contentRef)
          .then((url) => {
            axios
              .post('http://localhost:5000/api/posts/post/', {
                content: url ? url : '',
                caption: caption,
              },
              {
                withCredentials: true,
              })
              .then((response) => {
                if (response.status === 200) {
                  setMessage('Upload berhasil!')
                  setInterval(() => {
                    window.location.href = '/profile'
                  }, 1000)
                }
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch((error) => console.log(error))
      })
  }

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users/mydata/', {
        withCredentials: true,
      })
      .then((res) => {
        setLogged(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setLogged(false)
          }
        }
      })

    return () => {
      setContent(null)
      setCaption('')
      setMessage('')
    }
  }, [])

  return (
    <div style={centerBoxStyle}>
      {logged ? (
        <div style={uploadFormStyle}>
          {content ? (
            <div>
              {content.type.includes('image') ? (
                <img
                  style={{ width: '100%', height: '300px' }}
                  src={URL.createObjectURL(content)}
                  alt="Selected"
                />
              ) : (
                <video controls width="300" height="300">
                  <source src={URL.createObjectURL(content)} type={content.type} />
                  Browser anda tidak mendukung tag video!
                </video>
              )}
            </div>
          ) : (
            <div style={{ width: '100%', height: '300px', background: 'grey' }} />
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <input
                className="fileUploadPost"
                type="file"
                id="contentUpload"
                accept="image/*,video/*"
                onChange={handleContentChange}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Caption..."
                id="caption"
                className="uploadCaption"
                value={caption}
                onChange={handleCaptionChange}
              />
            </div>
            <div>
              <button className="submitUpload" type="submit">Submit</button>
            </div>
          </form>
          {message}
        </div>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
      <Navbar />
    </div>
  )
}

export default UploadPage
