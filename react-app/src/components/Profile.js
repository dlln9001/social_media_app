import SideBar from "./SideBar"
import '../App.css'
import { useEffect, useState } from "react"
import { IoMdGrid } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";
import { json } from "react-router-dom";


function Profile() {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [userPosts, setUserPosts] = useState(false)
    const [userPfp, setUserpfp] = useState('')
    const [showFullImgVar, setShowFullImageVar] = useState(false)
    const [showImageOptionsVar, setShowImageOptionsVar] = useState(false)
    const [showPfpOptionsVar, setShowPfpOptionsVar] = useState(false)
    // when a user clicks to expand a image, store some data as these variables
    const [selectedImgUrl, setSelectedImgUrl] = useState('')
    const [selectedImgRatio, setSelectedImgRatio] = useState('')

    
    useEffect(() => {
        // fetches all the user's posts
        fetch('http://127.0.0.1:8000/profile/posts/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`}
        })
        .then(res => res.json())
        .then(data => {
            // reversed so top posts is newest, oldest is at the bottom
            setUserPosts(data.postData.reverse())
        })

        // fetches the user's profile picture
        fetch('http://127.0.0.1:8000/profile/getpfp/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`}
        })
        .then(res => res.json())
        .then((data) => {
            if (data.userPfp.default_pfp === true) {
                setUserpfp('http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png')
            }
            else {
                const absolute_url = 'http://127.0.0.1:8000' + data.userPfp.user_pfp_url
                setUserpfp(absolute_url)
            }
        })
    }, [])

    // sends a request to delete the post
    function deletePost() {
        // slice off the "http://127.0.0.1:8000/media/"
        const sliced_url = selectedImgUrl.slice(28)
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

    // when a user clicks on the image preview, they'll get the full image
    function showFullImg(e) {
        setSelectedImgUrl(e.target.src)
        // so we can name the css class differently
        if (e.target.name === 'one_to_one'){
            setSelectedImgRatio('selectedImageOneToOne')
        }
        else{
            setSelectedImgRatio('selectedImageOriginal')
        }
        setShowFullImageVar(true)
    }

    function showImageOptions() {
        setShowImageOptionsVar(true)
    }

    // when something is clicked, close out the enlarged image 
    function closeImage() {
        setShowFullImageVar(false)
        setShowImageOptionsVar(false)
        setSelectedImgRatio('')
        setSelectedImgUrl('')
    }


    function changePfp(e) {
        const pfpFile = new FormData()
        pfpFile.append('pfp_file', e.target.files[0])
        fetch('http://127.0.0.1:8000/profile/uploadpfp/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`},
            body: pfpFile,
        })
        .then(res => res.json())
        .then(data => window.location.reload())
    }

    function removePfp() {
        fetch('http://127.0.0.1:8000/profile/removepfp/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`},
        })
        .then(res => res.json())
        .then((data) => {
            window.location.reload()
        })
    }

    // so we can use user and extra user without getting from local storage every time
    let user = ''
    if (localStorage.getItem('userData')) {
        user = JSON.parse(localStorage.getItem('userData')).user
    }
    let extraUser = false
    if (localStorage.getItem('extraUserData')) {
        extraUser = JSON.parse(localStorage.getItem('extraUserData')).extraUserData
    }

    // gets all the posts, and makes html elements to render the images
    const userPostsHtml = []
    if(userPosts) {
        for (let i=0; i < userPosts.length; i++) {
            userPostsHtml.push(
                // get's absolute url
                <img 
                src={'http://127.0.0.1:8000' + userPosts[i].image} 
                key={i} 
                className="imgPreview" 
                onClick={showFullImg} 
                name={userPosts[i].aspect_ratio}/>
            )
        }
    }

    return (
        <div className="homepage">
            <SideBar />
            {showPfpOptionsVar && <div className="changeBack" onClick={() => setShowPfpOptionsVar(false)}></div>}
            {(extraUser && userPosts) && 
            <div className="profileOverview">
                <img src={userPfp} alt="" className="userPfp" onClick={() => setShowPfpOptionsVar(true)}/>
                {showPfpOptionsVar &&
                <>
                    <div className="pfpOptions">
                        <p style={{padding: '10px'}}>Change Profile Photo</p>
                        <form action="" className="pfpOptionsForm">
                            <label className="pfpImageInputLabel" htmlFor="pfpImageInput"><p style={{color: '#00BFFF', margin: '0px'}}>Upload Photo</p></label>
                            <input type="file" className="fileInput" accept="image/*" id="pfpImageInput" onChange={changePfp}/>
                        </form>
                        <div className="pfpOptionsTxt" onClick={removePfp}><p className="pfpRemoveCurrentPhoto">Remove Current Photo</p></div>
                        <p className="pfpOptionsTxt" onClick={() => setShowPfpOptionsVar(false)}>Cancel</p>
                    </div>
                </>
                }
                <div>
                    <div style={{display: 'flex'}}>
                        <p style={{fontSize: '25px'}}>{user.username}</p>
                        <button className="editProfileButton" onClick={() => window.location.pathname = '/settings'}>Edit Profile</button>
                    </div>
                    <div className="profileOverviewNums">
                        <p className="profileOverviewNum"><strong>{userPosts.length}</strong> Posts</p>
                        <p className="profileOverviewNum"><strong>{extraUser.followers.length}</strong> Followers</p>
                        <p className="profileOverviewNum"><strong>{extraUser.followers.length}</strong> Following</p>
                    </div>
                    <p className="profileName">{user.first_name ? user.first_name : ''}</p>
                    <p className="profileBio">{extraUser.bio ? extraUser.bio : ''}</p>
                </div>
            </div>
            }
            {
            userPosts &&
            <div className="postsPreviewSection">
                <div className="PostsSelection"><IoMdGrid /> <p className="PostsTxt">POSTS</p></div>
                {
                userPosts.length != 0
                 ? 
                 <div className="postsFlexBox">{userPostsHtml}</div>
                 : 
                 <div className="noPostsYet"><CiCamera className="noPostsIcon"/> <strong className="noPostsTxt">No Posts Yet</strong></div>
                }
            </div>
            }
            {showFullImgVar &&
            <>
                <div className="changeBack" onClick={closeImage}></div>
                <div className="selectedImageContainer">
                    <img src={selectedImgUrl} className={selectedImgRatio} onClick={() => setShowImageOptionsVar(false)}/>
                    <div className="selectedImgSide">
                        <SlOptions className="imageOptionsIcon" onClick={showImageOptions}/>
                        { showImageOptionsVar &&
                            <div className="imageOptions">
                                <p className="deleteImage" onClick={deletePost}>Delete</p>
                                <p className="cancelImageOptions" onClick={() => setShowImageOptionsVar(false)} >Cancel</p>
                            </div>
                        }
                    </div>
                </div>
            </>
            }
        </div>
    )
}

export default Profile