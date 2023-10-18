import React, { Component } from "react"
import axios from "axios"
import { Navigate } from 'react-router-dom'
import MiniPost from "./components/MiniPost"
import Comment from "./components/Comment"

class SavedPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logged: true,
            posts: [],
            comments: [],
            tabs: "posts"
        }
    }
    changeTabs = (tabs) => {
        const stateValues = { ...this.state }
        stateValues["tabs"] = tabs
        this.setState(stateValues)
    }

    componentDidMount() {
        const user_id = localStorage.getItem("my_user_id")
        let url = `http://localhost:5000/api/users/${user_id}/postsaves/`
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

        let url_comments = `http://localhost:5000/api/users/${user_id}/commentsaves/`
        axios.get(url_comments, {
            withCredentials: true
        })
            .then(res => {
                const stateValues = { ...this.state }
                stateValues["comments"] = res.data
                this.setState(stateValues)
            })
            .catch(error => {
                const stateValues = { ...this.state }
                stateValues["comments"] = []
                this.setState(stateValues)
            })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-6 text-white bg-secondary" onClick={() => this.changeTabs("posts")}>Posts</div>
                    <div className="col-6 text-white bg-secondary" onClick={() => this.changeTabs("comments")}>Comments</div>
                </div>
                {this.state.logged === true ? (
                    this.state.tabs === "posts" ? (
                        <div className="row">
                            {this.state.posts.map((item) => (
                                <MiniPost
                                    key={item.post_id}
                                    post_id={item.post_id}
                                    content={item.content}
                                    timestamp={item.timestamp}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="row">
                            {this.state.comments.map((item) => (
                                <Comment
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
            </div>
        )
    }
}

export default SavedPage
