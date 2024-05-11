import { useState, useEffect, useRef } from 'react'
import { SlOptions } from "react-icons/sl";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";


function ExpandedPost(props) {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')).user)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [showCommentOptions, setShowCommentOptions] = useState(false)
    const [selectedCommentId, setSelectedCommentId] = useState('')
    // slice off the "http://127.0.0.1:8000/media/", so backend can use
    const [sliced_url, setSliced_url] = useState(props.selectedImgUrl.slice(28))
    const [postLiked, setPostLiked] = useState(false)
    const [numOfLikes, setNumOfLikes] = useState(0)
    const [showLikes, setShowLikes] = useState(false)
    const [showLikesHtml, setShowLikesHtml] = useState('')
    const commentRef = useRef(null)
    let isStrangerUser = (props.user.username != user.username)

    useEffect(() => {
        getComments()
        getLike()
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
                            <img src={absolute_url} className='commentPfp' onClick={() => window.location.pathname = '/user/' + data.users[i].username}/>
                            <div className='flex'>
                                <p className='commentUsername' onClick={() => window.location.pathname = '/user/' + data.users[i].username}>{data.users[i].username}</p>
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

    function submitLike(){
        fetch('http://127.0.0.1:8000/post/submitlike/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                post_selected: sliced_url,
            })
        })
        .then(res => res.json())
        .then(data => getLike())
    }

    async function getLike(isGetLikers=false) {
        let response = await fetch('http://127.0.0.1:8000/post/getlike/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post_selected: sliced_url,
            })
        })

        // data = {
        //     liked: true,
        //     num_of_likes: ...,
        //     liker_data: [{username: ..., first_name: ..., user_pfp_url: ..., default_pfp: ..., ...}, {...}, {...}]
        // }
        // or 
        // data = {
        //     liked: false,
        //     num_of_likes: ...,
        //     liker_data: ...,
        // }

        let data = await response.json()
        let dataLiked = JSON.parse(data.liked)
        setPostLiked(dataLiked)
        if (data.num_of_likes) {
            setNumOfLikes(data.num_of_likes)
        }
        else{
            setNumOfLikes(0)
        }
        if (isGetLikers) {
            return data.liker_data
        }
    }

    async function showAllLikes() {
        let likesHtml = []
        let liker_data = await getLike(true)
        for (let i=0; i < liker_data.length; i++) {
            let absolute_url = 'http://127.0.0.1:8000' + liker_data[i].user_pfp_url
            if (liker_data[i].default_pfp) {
                absolute_url = 'http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png'
            }
            likesHtml.push(
                <div key={i} className="followLikesContainer">
                    <img src={absolute_url} alt="" className="followLikesProfilePic" onClick={() => window.location.pathname = '/user/' + liker_data[i].username}/>
                    <div className="followLikesNamesContainer">
                        <p className="followLikesUsername" onClick={() => window.location.pathname = '/user/' + liker_data[i].username}>{liker_data[i].username}</p>
                        <p className="followLikesFirstName">{liker_data[i].first_name}</p>
                    </div>
                </div>
            )
        }

        if (liker_data.length === 0) {
            likesHtml.push (
                <p className='noFollowLikes'>No likes yet</p>
            )
        }

        setShowLikesHtml(likesHtml)
        setShowLikes(true)
    }
    
    return (
        <>
        <div className="selectedImageContainer">
            <img src={props.selectedImgUrl} className={props.selectedImgRatio} onClick={() => props.setShowImageOptionsVar(false)}/>
            <div className="selectedImgSide">
                <div className="selectedImgSideTop">
                    <div className="selectedImgUserDetails">
                        <img src={props.userPfp} className="selectedImgPfp" onClick={() => window.location.pathname = '/user/' + props.user.username}/>
                        <p className="selectedImgUsername" onClick={() => window.location.pathname = '/user/' + props.user.username}>{props.user.username}</p>
                    </div>
                    {!isStrangerUser &&
                    <SlOptions className="imageOptionsIcon" onClick={showImageOptions}/>
                    }
                </div>
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
                        {postLiked 
                        ?
                        <IoMdHeart className='postLikeProfile' onClick={submitLike} style={{color: 'red'}}/> 
                        : 
                        <IoMdHeartEmpty className='postLikeProfile' onClick={submitLike}/>
                        }
                        <IoChatbubbleOutline className='postCommentProfile' onClick={() => commentRef.current.focus()}/>
                    </div>
                    <div style={{marginLeft: '12px'}}>
                        {numOfLikes === '1' 
                        ?
                        <p className='likeCount' onClick={showAllLikes}>{numOfLikes} like</p>
                        :
                        <p className='likeCount' onClick={showAllLikes}>{numOfLikes} likes</p>
                        }
                        <p className='postDate'>{props.selectedImgDate.getMonth() + 1}/{props.selectedImgDate.getDate()}/{props.selectedImgDate.getFullYear()}</p>
                    </div>
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
        {/* The Post Options Section */}
        { props.showImageOptionsVar &&
                    <div className="imageOptions">
                        <p className="deleteImage" onClick={deletePost}>Delete</p>
                        <p className="cancelImageOptions" onClick={() => props.setShowImageOptionsVar(false)} >Cancel</p>
                    </div>
        }
        {/* The Comment Options Section */}
        {showCommentOptions &&
            <>  
                <div className='commentOptionsContainer'>
                    <p id='commentOptionDelete' onClick={deleteComment}>Delete</p>
                    <p onClick={() => setShowCommentOptions(false)} id='commentOptionCancel'>Cancel</p>
                </div>
            </>
        }
        {showCommentOptions || props.showImageOptionsVar || showLikes 
        ?
        <div className='changeBackCommentOptions' onClick={() => {
            setShowCommentOptions(false)
            props.setShowImageOptionsVar(false)
            setShowLikes(false)
        }}></div> 
        : 
        <div className="changeBack" onClick={closeImage}></div>
        }
        {/* show all likers of a post */}
        {showLikes &&
            <> 
            
            <div className='allLikesContainer'>
                <p className="followLikesTxt">Likes</p>
                <div className='followLikeUsers'>
                    {showLikesHtml}
                </div>
            </div>
            </> 
        }
        </>
        
    )
}

export default ExpandedPost