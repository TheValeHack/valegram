import React from "react"
import { Link } from "react-router-dom";

const MiniPost = (props) => {
    const postLink = `/post/${props.post_id}`;
    const getFileExtensionFromURL = (url) => {
        const parsedURL = new URL(url)
      
        const path = parsedURL.pathname
      
        const parts = path.split('.')
        if (parts.length > 1) {
          return parts[parts.length - 1]
        } else {
          return ''
        }
      }
      const contentUrl = () => {
         const ext = getFileExtensionFromURL(props.content)
         if ((ext === "mp4") || (ext === "mkv") || (ext === "mov") || (ext === "3gp")){
            return "https://firebasestorage.googleapis.com/v0/b/valegram-storage.appspot.com/o/contents%2Fvideo.png?alt=media&token=8ee76e6c-ed4c-4649-a067-c47d51e14b05&_gl=1*p5d29p*_ga*MTU5MzgzNzUxNy4xNjk3NTU0NzAy*_ga_CW55HF8NVT*MTY5NzYwMzQ4Ni42LjEuMTY5NzYwMzU0Mi40LjAuMA.."
         }
         return props.content
      }

    const miniPostStyle = {
        background: `url(${contentUrl()}) center/cover no-repeat`,
        height: '200px',
        width: '100%',
        cursor: 'pointer',
        border: "10px solid white",
        boxShadow: "1px 18px 36px -9px rgba(24,51,100,0.38)"
    };

    return (
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4d-flex justify-content-center">
        <Link to={postLink}>
            <div className="mini-post mt-4" style={miniPostStyle}></div>
        </Link>
        </div>
    )
}

export default MiniPost