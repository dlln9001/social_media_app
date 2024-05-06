import { useState, useEffect, useRef } from 'react'
import { SlOptions } from "react-icons/sl";
import { CiHeart } from "react-icons/ci";
import { IoChatbubbleOutline } from "react-icons/io5";


function ExpandedPost(props) {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')).user)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [showCommentOptions, setShowCommentOptions] = useState(false)
    const [selectedCommentId, setSelectedCommentId] = useState('')
    // slice off the "http://127.0.0.1:8000/media/"
    const [sliced_url, setSliced_url] = useState(props.selectedImgUrl.slice(28))
    const commentRef = useRef(null)

    useEffect(() => {
        getComments()
    }, [])

    function getComments() {
        fetch('http://127.0.0.1:8000/post/getcomment/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selected_post: sliced_url,
            })
        })
        .then(res => res.json())
        .then(data => {
            // data = {
            //     comments: [{text: ... , date_created ..., id: ...}, {...}, ],
            //     userPfps: [{user_pfp_url: ..., default_pfp: ...}, {...}],
            //     users: [{id: ..., username: ..., first_name ...}, {...}],
            // }
            let comments_html = []
            for (let i=0; i < data.comments.length; i++) {
                let absolute_url = 'http://127.0.0.1:8000' + data.userPfps[i].user_pfp_url
                const time_ago = timeAgo(data.comments[i].date_created)
                if (data.userPfps[i].default_pfp === true) {
                    absolute_url = 'http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png'
                }

                comments_html.push(
                    <div key={i} className='commentContainer'>
                        <div className='flex'>
                            <img src={absolute_url} className='commentPfp'/>
                            <div className='flex'>
                                <p className='commentUsername'>{data.users[i].username}</p>
                                <p className='commentUserText'>{data.comments[i].text}</p>
                            </div>
                        </div>
                            <div className='flex'>
                                <p className='commentsTimeAgo'>{time_ago}</p>
                                {data.users[i].username === user.username &&
                                    <SlOptions className='commentsOptions' onClick={commentOptionsClicked} name={data.comments[i].id}/>
                                }
                            </div>
                    </div>
                )
                
            }
            setComments(comments_html)
        })
    }

    function commentOptionsClicked(e) {
        setShowCommentOptions(true)
        // sometimes the child element is clicked, so get the parent if that happens, since the parent has the id we want
        if (e.target.getAttribute('name') === null){
            setSelectedCommentId(e.target.parentElement.getAttribute('name'))
        }
        else {
            setSelectedCommentId(e.target.getAttribute('name'))
        }
    }

    function deleteComment() {
        fetch('http://127.0.0.1:8000/post/deletecomment/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment_id: selectedCommentId,
            })
        })
        .then(res => res.json())
        .then(data => {
            getComments()
            setShowCommentOptions(false)
        })
    }

    // gets how long the comment was made ago
    function timeAgo(dateString) {
        const date = new Date(dateString)
        const now = new Date()
        const seconds = Math.round((now - date) / 1000)
        const minutes = Math.round(seconds / 60)
        const hours = Math.round(minutes / 60)
        const days = Math.round(hours / 24)
      
        if (seconds < 60) {
          return 'just now'
        } else if (minutes < 60) {
          return minutes + 'm'
        } else if (hours < 24) {
          return hours + 'h'
        } else {
          return days + 'd'
        }
      }

    // sends a request to delete the post
    function deletePost() {
        fetch('http://127.0.0.1:8000/post/delete/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post_url: sliced_url
            })
        })
        .then(res => res.json())
        .then((data) => {
            window.location.reload()
        })
    }

    function showImageOptions() {
        props.setShowImageOptionsVar(true)
    }

    // when something is clicked, close out the enlarged image 
    function closeImage() {
        props.setShowFullImageVar(false)
        props.setShowImageOptionsVar(false)
        props.setSelectedImgRatio('')
        props.setSelectedImgUrl('')
    }

    function submitComment(e) {
        e.preventDefault()
        fetch('http://127.0.0.1:8000/post/createcomment/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                comment_text: commentText,
                post_commented: sliced_url,
            })
        })
        .then(res => res.json())
        .then(data => {
            setCommentText('')
            getComments()
        })
    }
    
    return (
        <>
        <div className="selectedImageContainer">
            <img src={props.selectedImgUrl} className={props.selectedImgRatio} onClick={() => props.setShowImageOptionsVar(false)}/>
            <div className="selectedImgSide">
                <div className="selectedImgSideTop">
                    <div className="selectedImgUserDetails">
                        <img src={props.userPfp} className="selectedImgPfp"/>
                        <p className="selectedImgUsername">{user.username}</p>
                    </div>
                    <SlOptions className="imageOptionsIcon" onClick={showImageOptions}/>
                </div>
                { props.showImageOptionsVar &&
                    <div className="imageOptions">
                        <p className="deleteImage" onClick={deletePost}>Delete</p>
                        <p className="cancelImageOptions" onClick={() => props.setShowImageOptionsVar(false)} >Cancel</p>
                    </div>
                }
                <div className='commentSection'>
                    {comments.length === 0 
                    ?   
                    <h2 className='noCommentsYet'>No comments yet.</h2>
                    :
                    <div>{comments}</div>
                    }
                </div>
                <div className='postInteractionSection'>
                    <div>
                        <CiHeart className='postLikeProfile'/>
                        <IoChatbubbleOutline className='postCommentProfile' onClick={() => commentRef.current.focus()}/>
                    </div>
                    <p className='postDate'>{props.selectedImgDate.getMonth() + 1}/{props.selectedImgDate.getDate()}/{props.selectedImgDate.getFullYear()}</p>
                    <form action="" onSubmit={submitComment}>
                        <input type="text" className='addCommentInput' placeholder='Add a comment...' minLength='1' maxLength='2000'
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        ref={commentRef}
                        />
                        {commentText ? <button className='submitComment'>Post</button> : <button id='submitCommentNotFilled' disabled>Post</button>}
                    </form>
                </div>
            </div>
        </div>
        {/* The Comment Options Section */}
        {showCommentOptions &&
            <>  
                <div className='commentOptionsContainer'>
                    <p id='commentOptionDelete' onClick={deleteComment}>Delete</p>
                    <p onClick={() => setShowCommentOptions(false)} id='commentOptionCancel'>Cancel</p>
                </div>
            </>
        }
        {showCommentOptions 
        ?
        <div className='changeBackCommentOptions' onClick={() => setShowCommentOptions(false)}></div> 
        : 
        <div className="changeBack" onClick={closeImage}></div>
        }
        </>
    )
}

export default ExpandedPost