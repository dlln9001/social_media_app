import SideBar from "./SideBar"
import '../App.css'
import { useEffect, useState } from "react"
import { IoMdGrid } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import ChangePfp from "./ChangePfp";
import ExpandedPost from "./ExpandedPost";
import { useParams } from "react-router-dom";


function Profile() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')).user)
    const [extraUser, setExtraUser] = useState(JSON.parse(localStorage.getItem('extraUserData')).extraUserData)
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [userPosts, setUserPosts] = useState(false)
    const [userPfp, setUserpfp] = useState('')
    const [showFullImgVar, setShowFullImageVar] = useState(false)
    const [showImageOptionsVar, setShowImageOptionsVar] = useState(false)
    const [showPfpOptionsVar, setShowPfpOptionsVar] = useState(false)
    // when a user clicks to expand a image, store some data as these variables
    const [selectedImgUrl, setSelectedImgUrl] = useState('')
    const [selectedImgRatio, setSelectedImgRatio] = useState('')
    const [selectedImgDate, setSelectedImgDate] = useState('')
    // for stranger users (users other than the logged in one)
    const {username} = useParams()
    const [isFollowed, setIsFollowed] = useState(false)
    // so we know if it's a stranger's user profile, get a boolean value
    let isStrangerUser = (username != JSON.parse(localStorage.getItem('userData')).user.username)

    useEffect(() => {
        getExtraData(username)
        if (isStrangerUser) {
            getUser(username)
        }

        getIsFollowed()

        // fetches all the user's posts
        fetch('http://127.0.0.1:8000/profile/posts/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: username,
            })
        })
        .then(res => res.json())
        .then(data => {
            // reversed so top posts is newest, oldest is at the bottom
            setUserPosts(data.postData.reverse())
        })

        // fetches the user's profile picture
        fetch('http://127.0.0.1:8000/profile/getpfp/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                user_name: username
            })
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

    function getExtraData(username) {
        fetch('http://127.0.0.1:8000/profile/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: username
            })
        })
        .then(res => res.json())
        .then(data => {
            setExtraUser(data.extraUserData)
        })
    }

    function getUser(username) {
        fetch('http://127.0.0.1:8000/profile/getuser/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                user_name: username
            })
        })
        .then(res => res.json())
        .then(data => setUser(data.user))
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
        // get date from the id
        const date_created = new Date(userPosts[parseInt(e.target.id)].date_created)
        setSelectedImgDate(date_created)
        setShowFullImageVar(true)
    }

    function followUser() {
        fetch('http://127.0.0.1:8000/profile/followuser/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                following_user: JSON.parse(localStorage.getItem('userData')).user.username,
                followed_user: username
            })
        })
        .then(res => res.json())
        .then(data => {
            getIsFollowed()
            getExtraData(username)
            
        })
    }

    // check if the user is already followed to another user or not
    function getIsFollowed(){
        fetch('http://127.0.0.1:8000/profile/isfollowed/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                following_user: JSON.parse(localStorage.getItem('userData')).user.username,
                followed_user: username
            })
        })
        .then(res => res.json())
        .then(data => {
            // data = {
            //     isFollowed: ...
            // }
            // either true or false
            setIsFollowed(data.isFollowed)
        })
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
                name={userPosts[i].aspect_ratio} 
                id={i.toString()}/>
            )
        }
    }

    return (
        <div className="homepage">
            <SideBar />
            {(showPfpOptionsVar && !isStrangerUser) && <div className="changeBack" onClick={() => setShowPfpOptionsVar(false)}></div>}
            {/* Wait for it to get data before trying loading */}
            {(extraUser && userPosts) && 
            <div className="profileOverview">
                <img src={userPfp} alt="" className="userPfp" onClick={() => setShowPfpOptionsVar(true)}/>
                {(showPfpOptionsVar && !isStrangerUser) &&
                <>
                    <ChangePfp showPfpOptionsVar={showPfpOptionsVar} setShowPfpOptionsVar={setShowPfpOptionsVar}/>
                </>
                }
                <div>
                    <div style={{display: 'flex'}}>
                        <p style={{fontSize: '25px'}}>{user.username}</p>
                        {!isStrangerUser 
                        ?
                        <button className="editProfileButton" onClick={() => window.location.pathname = '/settings'}>Edit Profile</button>
                        :
                         isFollowed ? <button className="followButton following" onClick={followUser}>Following</button> : <button className="followButton follow" onClick={followUser}>Follow</button>
                        }
                    </div>
                    <div className="profileOverviewNums">
                        <p className="profileOverviewNum"><strong>{userPosts.length}</strong> Posts</p>
                        {extraUser.followers.length === 1 
                        ?
                        <p className="profileOverviewNum"><strong>{extraUser.followers.length}</strong> follower</p>
                        :
                        <p className="profileOverviewNum"><strong>{extraUser.followers.length}</strong> followers</p>
                        }
                        <p className="profileOverviewNum"><strong>{extraUser.following.length}</strong> following</p>
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
                <ExpandedPost 
                showFullImgVar={showFullImgVar} setShowFullImageVar={setShowFullImageVar} 
                showImageOptionsVar={showImageOptionsVar} setShowImageOptionsVar={setShowImageOptionsVar} 
                userPfp={userPfp} setUserPfp={setUserpfp} 
                selectedImgUrl={selectedImgUrl} setSelectedImgUrl={setSelectedImgUrl} 
                selectedImgRatio={selectedImgRatio} setSelectedImgRatio={setSelectedImgRatio} 
                selectedImgDate={selectedImgDate} setSelectedImgDate={setSelectedImgDate}
                user={user} setUser={setUser}
                />
            </>
            }
        </div>
    )
}

export default Profile