import React from "react"
import axios from "axios"

class LogoutPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            "message": "Logout berhasil!"
        }
    }
    componentDidMount(){
        axios.get("http://localhost:5000/api/users/mydata/", {
            withCredentials: true
        })
            .then(res => {
                axios.get("http://localhost:5000/logout/", {
                    withCredentials: true
                })
                    .then(res => {
                        localStorage.removeItem('my_user_id')
                         setInterval(() => {
                            window.location.href = "/login"
                         }, 1000)
                    }).catch(error =>  {
                        console.log(error)
                    })
            }).catch(error => {
                this.setState({
                    "message": "Anda belum login"
                 })
                 setInterval(() => {
                    window.location.href = "/login"
                 }, 1000)
            })
    }
    render(){
        return (
            <div>
                <p>{this.state.message}</p>
                <p>Redirecting...</p>
            </div>
        )
    }
}


export default LogoutPage