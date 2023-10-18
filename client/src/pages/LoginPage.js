import React from "react"
import axios from "axios"
import { Link } from "react-router-dom"

class LoginPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            "acc": "",
            "password": "",
            "message": ""
        }
    }
    componentDidMount(){
        axios.get("http://localhost:5000/api/users/mydata/", {
            withCredentials: true
        })
            .then(res => {
                window.location.href = "/"
            }).catch(error => {
                if (error.response) {
                    console.log(error.response.data)
                } else if (error.request) {
                    console.log(error.request)
                } else {
                    console.log('Error', error.message)
                }
            })
    }
    changeData(event){
        let formValues = { ...this.state }
        let name = event.target.name
        let value = event.target.value

        formValues[name] = value

        this.setState(formValues)
    }
    sendData(e){
        let formValues = {...this.state}
        e.preventDefault();  
        axios
            .post("http://localhost:5000/login/", formValues, {
                withCredentials: true
            })
            .then((response) => {
                let data = {...this.state}
                if(response.status === 200){
                    let user_id = response.data.id
                    localStorage.setItem('my_user_id', user_id)
                    data["logged"] = true
                    data["message"] = "Login berhasil!"
                    this.setState(data)
                    setInterval(() => {
                        window.location.href = "/"
                    }, 1000)
                }
            })
            .catch((error) => {
                let stateValues = { ...this.state }
                stateValues["message"] = error.response.data.error
                this.setState(stateValues)
            })
    }
    render(){
        return (
            <form onSubmit={this.sendData.bind(this)}>
            <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4">
                <h1 className="text-center mb-4">Login</h1>
                <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Username" name="acc" onChange={this.changeData.bind(this)}/>
                        </div>
                        <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={this.changeData.bind(this)}/>
                        </div>
                        <button className="btn btn-primary w-100 pointer" type="submit" onClick={this.sendData.bind(this)}>Login</button>
                    <p className="text-center mt-3">Belum punya akun? <Link to="/register">Register</Link></p>
                    { this.state.message.length > 0 ? (
                <div className={`alert ${this.state.message === "Login berhasil!" ? "alert-success" : "alert-danger"}`} role="alert">
                {this.state.message}
              </div>              
            ) : "" }
            </div>
            </div>
            </form>
        )
    }
}

export default LoginPage