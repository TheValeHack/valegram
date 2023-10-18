import React, { useState, useEffect } from "react"
import axios from "axios"

const SaveButton = (props) => {
  const [saveStatus, setSaveStatus] = useState(false)
  const post_id = props.post_id
  const type = props.type

  const savePost = () => {
    axios
      .post(
        `http://localhost:5000/api/${type}/${post_id}/${
          saveStatus ? "unsave" : "save"
        }/`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setSaveStatus(!saveStatus)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/${type}/${post_id}/savestatus/`, {
        withCredentials: true,
      })
      .then((res) => {
        const status = res.data.save
        setSaveStatus(status)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [post_id, type])

  return (
    <div>
    {saveStatus ? (
      <svg onClick={savePost} className="saveButton" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="27" height="27"><path d="M16,2H8C6.3,2,5,3.3,5,5v16c0,0.2,0,0.3,0.1,0.5C5.4,22,6,22.1,6.5,21.9l5.5-3.2l5.5,3.2C17.7,22,17.8,22,18,22
      c0.6,0,1-0.4,1-1V5C19,3.3,17.7,2,16,2z"/></svg>
    ) : (
      <svg  onClick={savePost} className="saveButton" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="27" height="27"><path d="M16,2H8C6.3438721,2.0018311,5.0018311,3.3438721,5,5v16.5c0.0001221,0.0870972,0.0230103,0.1727295,0.0663452,0.248291C5.2039795,21.9882202,5.5100708,22.071167,5.75,21.9335938L12,18.3339844l6.25,3.5996094C18.3262329,21.9768677,18.4123535,21.9997559,18.5,22c0.2759399-0.0004883,0.4995117-0.2240601,0.5-0.5V5C18.9981689,3.3438721,17.6561279,2.0018311,16,2z M18,20.6347656l-5.75-3.3115234c-0.0762329-0.0432739-0.1623535-0.0661621-0.25-0.0664062c-0.0876465,0.0002441-0.1737671,0.0231323-0.25,0.0664062L6,20.6347656V5c0.0014038-1.1040039,0.8959961-1.9985962,2-2h8c1.1040039,0.0014038,1.9985962,0.8959961,2,2V20.6347656z"/></svg>
    )}
    </div>
  )
}

export default SaveButton