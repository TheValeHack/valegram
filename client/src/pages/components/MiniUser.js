import React from "react"

const MiniUser = (props) => {
    const clickUser = () => {
        let user_id = props.user_id
        window.location.href = "/user/"+user_id
    }
    return (
        <div className="flex row"
        onClick={clickUser} 
        style={{
            "width": "100%",
            "marginTop": "20px",
            "padding": "10px 0",
            "border-bottom": "1px solid rgba(0, 0, 0, .4)",
            "cursor": "pointer"
        }}>
           <div className="col-2">
            <img src={props.profile_photo} width="50px" height="50px" style={{"borderRadius":"50%"}} />
           </div>
           <div className="col-10 d-flex align-items-center">
            <b>{props.username}</b>
           </div>
        </div>
    )
}

export default MiniUser