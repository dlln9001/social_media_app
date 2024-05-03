import SideBar from "./SideBar"
import '../App.css'
import { useEffect, useState } from "react"
import { IoMdGrid } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";


function Profile() {
    const [userPosts, setUserPosts] = useState(false)
    const [showFullImgVar, setShowFullImageVar] = useState(false)
    const [showImageOptionsVar, setShowImageOptionsVar] = useState(false)
    // when a user clicks to expand a image, store some data
    const [selectedImgUrl, setSelectedImgUrl] = useState('')
    const [selectedImgRatio, setSelectedImgRatio] = useState('')

    function fetchExtra() {
        // fetches extra data, like followers of the user, etc.
        const userToken = JSON.parse(localStorage.getItem('userData')).token
        fetch('http://127.0.0.1:8000/profile/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('extraUserData', JSON.stringify(data))
                window.location.reload()
            })
            .catch(error => error)
        

    }

    // fetches all the users' posts
    useEffect(() => {
        const userToken = JSON.parse(localStorage.getItem('userData')).token
        fetch('http://127.0.0.1:8000/profile/posts/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`}
        })
        .then(res => res.json())
        .then(data => {
            setUserPosts(data)
        })

    }, [])

    // when a user clicks on the image preview, they'll get the full image
    function showFullImg(e) {
        setShowFullImageVar(true)
        setSelectedImgUrl(e.target.src)
        // so we can name the css class differently
        if (e.target.name === 'one_to_one'){
            setSelectedImgRatio('selectedImageOneToOne')

        }
        else{
            setSelectedImgRatio('selectedImageOriginal')
        }
    }

    function showImageOptions() {
        setShowImageOptionsVar(true)
    }

    if (!localStorage.getItem('extraUserData')){
        fetchExtra()
    }

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
    if(userPosts.postData) {
        for (let i=0; i < userPosts.postData.length; i++) {
            userPostsHtml.push(
                // get's absolute url
                <img 
                src={'http://127.0.0.1:8000' + userPosts.postData[i].image} 
                key={i} 
                className="imgPreview" 
                onClick={showFullImg} 
                name={userPosts.postData[i].aspect_ratio}/>
            )
        }
    }

    return (
        <div className="homepage">
            <SideBar />
            {extraUser && 
            <div className="profileOverview">
                <p style={{fontSize: '25px'}}>{user.username}</p>
                <p>{extraUser.followers.length} Followers</p>
                <p>{extraUser.followers.length} Following</p>
                <p>{extraUser.bio ? extraUser.bio : ''}</p>
            </div>
            }
            {
            userPosts.postData &&
            <div className="postsPreviewSection">
                <div className="PostsSelection"><IoMdGrid /> <p className="PostsTxt">POSTS</p></div>
                {
                userPosts.postData.length != 0
                 ? 
                 <div className="postsFlexBox">{userPostsHtml}</div>
                 : 
                 <div className="noPostsYet"><CiCamera className="noPostsIcon"/> <strong className="noPostsTxt">No Posts Yet</strong></div>
                }
            </div>
            }
            {showFullImgVar &&
            <>
                <div className="changeBack" onClick={() => setShowFullImageVar(false)}></div>
                <div className="selectedImageContainer">
                    <img src={selectedImgUrl} className={selectedImgRatio} />
                    <div className="selectedImgSide">
                        <SlOptions className="imageOptionsIcon" onClick={showImageOptions}/>
                        { showImageOptionsVar &&
                            <div>Test</div>
                        }
                    </div>
                </div>
            </>
            }
        </div>
    )
}

export default Profile