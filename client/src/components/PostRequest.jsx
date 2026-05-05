import React from 'react'
import "../styles/postRequest.css"
import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const PostRequest = () => {
    const navigate = useNavigate()
    return (
        <div className="post-request-wrapper">
            <div className="post-request-box">
                <div className="post-request-text">
                    <h3>Request to Add Organization/College</h3>
                    <p>Can't find your institution? You can submit a request to add any organization or college to our platform.</p>
                </div>
                <button onClick={()=>{navigate('/request')}} className="post-request-button" type="button">
                    <PlusCircle size={20} />
                    Post Request
                </button>
            </div>
        </div>
    )
}

export default PostRequest
