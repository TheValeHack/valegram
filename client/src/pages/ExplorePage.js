import React, { Component } from "react"
import axios from "axios"
import { Navigate } from 'react-router-dom'
import MiniPost from "./components/MiniPost"
import MiniUser from "./components/MiniUser"
import Navbar from "./components/Navbar"

class ExplorePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logged: true,
            posts: [],
            users: [],
            query: "",
            tabs: "posts"
        }
    }

    searchData = (event) => {
        const query = event.target.value
        let stateValues = { ...this.state }
        stateValues["query"] = query
        this.setState(stateValues)
        let url = `http://localhost:5000/api/posts/${query.length > 0 ? `search/${query}/` : ""}/`
        axios.get(url, {
            withCredentials: true
        })
            .then(res => {
                const stateValues = { ...this.state }
                stateValues["logged"] = true
                stateValues["posts"] = res.data
                this.setState(stateValues)
            })
            .catch(error => {
                const stateValues = { ...this.state }
                stateValues["logged"] = false
                stateValues["posts"] = []
                this.setState(stateValues)
            })

        let url_user = `http://localhost:5000/api/users/${query.length > 0 ? `search/${query}/` : ""}/`
        axios.get(url_user, {
            withCredentials: true
        })
            .then(res => {
                const stateValues = { ...this.state }
                stateValues["users"] = res.data
                this.setState(stateValues)
            })
            .catch(error => {
                const stateValues = { ...this.state }
                stateValues["users"] = []
                this.setState(stateValues)
            })
    }

    changeTabs = (tabs) => {
        const stateValues = { ...this.state }
        stateValues["tabs"] = tabs
        this.setState(stateValues)
    }

    componentDidMount() {
        axios.get("http://localhost:5000/api/posts/", {
            withCredentials: true
        })
            .then(res => {
                const stateValues = { ...this.state }
                stateValues["logged"] = true
                stateValues["posts"] = res.data
                this.setState(stateValues)
            })
            .catch(error => {
                const stateValues = { ...this.state }
                stateValues["logged"] = false
                stateValues["posts"] = []
                this.setState(stateValues)
            })

        axios.get("http://localhost:5000/api/users/", {
            withCredentials: true
        })
            .then(res => {
                const stateValues = { ...this.state }
                stateValues["users"] = res.data
                this.setState(stateValues)
            })
            .catch(error => {
                const stateValues = { ...this.state }
                stateValues["users"] = []
                this.setState(stateValues)
            })
    }

    render() {
        return (
            <div>
                <div>
                    <input class="searchExplore" type="text" placeholder="Search..." value={this.state.query} name="query" onChange={this.searchData}></input>
                </div>
                <div className="row exploreTabContainer">
                    <div className="col-6" onClick={() => this.changeTabs("posts")}>
                        <div className="exploreTab">
                            Posts
                        </div>
                    </div>
                    <div className="col-6" onClick={() => this.changeTabs("users")}>
                        <div className="exploreTab">
                            Users
                        </div>
                    </div>
                </div>
                {this.state.logged === true ? (
                    this.state.tabs === "posts" ? (
                        <div className="row">
                            {this.state.posts.map((item) => (
                                <MiniPost
                                    key={item.id}
                                    post_id={item.id}
                                    content={item.content}
                                    timestamp={item.timestamp}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="row">
                            {this.state.users.map((item) => (
                                <MiniUser
                                    key={item.id}
                                    profile_photo={item.profile_photo}
                                    content={item.content}
                                    user_id={item.user_id}
                                    username={item.username}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <Navigate to="/login" replace={true} />
                )}
                <Navbar />
            </div>
        )
    }
}

export default ExplorePage
