import SideBar from "./SideBar"
import '../App.css'
import { useEffect, useState } from "react"
import { IoMdGrid } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import ChangePfp from "./ChangePfp";
import ExpandedPost from "./ExpandedPost";


function Profile() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')).user)
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

    // get extraUserData
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
                name={userPosts[i].aspect_ratio} 
                id={i.toString()}/>
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
                    <ChangePfp showPfpOptionsVar={showPfpOptionsVar} setShowPfpOptionsVar={setShowPfpOptionsVar}/>
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
                <ExpandedPost 
                showFullImgVar={showFullImgVar} setShowFullImageVar={setShowFullImageVar} 
                showImageOptionsVar={showImageOptionsVar} setShowImageOptionsVar={setShowImageOptionsVar} 
                userPfp={userPfp} setUserPfp={setUserpfp} 
                selectedImgUrl={selectedImgUrl} setSelectedImgUrl={setSelectedImgUrl} 
                selectedImgRatio={selectedImgRatio} setSelectedImgRatio={setSelectedImgRatio} 
                selectedImgDate={selectedImgDate} setSelectedImgDate={setSelectedImgDate}
                />
            </>
            }
        </div>
    )
}

export default Profile