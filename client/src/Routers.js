import React from "react"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import LogoutPage from "./pages/LogoutPage"
import ExplorePage from "./pages/ExplorePage"
import PostPage from "./pages/PostPage"
import NotificationPage from "./pages/NotificationPage"
import ProfilePage from "./pages/ProfilePage"
import UserPage from "./pages/UserPage"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import UploadPage from "./pages/UploadPage.js"
import PostCommentsPage from "./pages/PostCommentsPage"
import LikedPage from "./pages/LikedPage"
import SavedPage from "./pages/SavedPage"

const Routers = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={ <HomePage/> }/>
                <Route exact path="/login" element={ <LoginPage/> }/>
                <Route exact path="/register" element={ <RegisterPage/> }/>
                <Route exact path="/logout" element={ <LogoutPage/> }/>
                <Route exact path="/explore" element={ <ExplorePage/> }/>
                <Route exact path="/post/:post_id" element={ <PostPage/> }/>
                <Route exact path="/post/:post_id/comments" element={ <PostCommentsPage/> }/>
                <Route exact path="/notifications" element={ <NotificationPage/> }/>
                <Route exact path="/profile" element={ <ProfilePage/> }/>
                <Route exact path="/user/:user_id" element={ <UserPage/> }/>
                <Route exact path="/updateProfile" element={ <UpdateProfilePage/> }/>
                <Route exact path="/upload" element={ <UploadPage/> }/>
                <Route exact path="/liked" element={ <LikedPage/> }/>
                <Route exact path="/saved" element={ <SavedPage/> }/>
            </Routes>
        </Router>
    )
}

export default Routers