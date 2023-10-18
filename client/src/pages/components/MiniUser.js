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
            "height": "100px",
            "background": "grey",
            "marginTop": "20px"
        }}>
           <div className="col-4">
            <img src={props.profile_photo} width="50px" height="50px" style={{"borderRadius":"50%"}} />
           </div>
           <div className="col-8">
            {props.username}
           </div>
        </div>
    )
}

export default MiniUser