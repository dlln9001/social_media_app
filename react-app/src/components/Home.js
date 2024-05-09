import SideBar from "./SideBar"
import '../App.css'
import { useEffect, useState } from "react"
import ExpandedPost from "./ExpandedPost";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuDot } from "react-icons/lu";


function Home() {
    // user set to nothing so it can be passed to ExpandedPosts component, handled there
    const [user, setUser] = useState({username: ''})
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [following, setFollowing] = useState(JSON.parse(localStorage.getItem('extraUserData')).extraUserData.following)
    const [allPosts, setAllPosts] = useState('')
    const [allPostsHtml, setAllPostsHtml] = useState('')
    const [showFullImgVar, setShowFullImageVar] = useState(false)
    const [showImageOptionsVar, setShowImageOptionsVar] = useState(false)
    // when a user clicks to expand a image, store some data as these variables
    const [selectedImgUrl, setSelectedImgUrl] = useState('')
    const [selectedImgRatio, setSelectedImgRatio] = useState('')
    const [selectedImgDate, setSelectedImgDate] = useState('')
    // this userpfp is the one refering to the poster of the clicked post to enlargen the image
    const [userPfp, setUserPfp] = useState('')


    useEffect(() => {
        getHomePosts()
    }, [])

    useEffect(() => {
        homePostsHtml()
    }, [allPosts])

    useEffect(() => {
        homePostsHtml()
    }, [showFullImgVar])

    // gets posts of users whom you follow
    function getHomePosts() {
        fetch('http://127.0.0.1:8000/home/posts/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                following: following,
            })
        })
        .then(res => res.json())
        .then(data => {
            setAllPosts(data.allPosts)
        })
    }

    function submitLike(sliced_url){
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
        .then(data => homePostsHtml())
    }

    async function getLike(sliced_url) {
        const response = await fetch('http://127.0.0.1:8000/post/getlike/', {
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
            // }
            // or 
            // data = {
            //     liked: false,
            //     num_of_likes: ...,
            // }
        const data = await response.json()
        return data
    }

    async function getPfp(username) {
        // fetches the user's profile picture
        const response = await fetch('http://127.0.0.1:8000/profile/getpfp/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                user_name: username
            })
        })
        // data = {
        //     userPfp: {user_pfp_url: ..., default_pfp: ...,}
        // }
        const data = await response.json()
        return data.userPfp
    }

    async function getComments(sliced_url) {
        const response = await fetch('http://127.0.0.1:8000/post/getcomment/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selected_post: sliced_url,
            })
        })
            // data = {
            //     comments: [{text: ... , date_created ..., id: ...}, {...}, ],
            //     userPfps: [{user_pfp_url: ..., default_pfp: ...}, {...}],
            //     users: [{id: ..., username: ..., first_name ...}, {...}],
            // }
        const data = await response.json()
        return data
    }

    async function homePostsHtml() {
        let postsHtml = []
        for (let i=0; i < allPosts.length; i++) {
            let absolute_url = "http://127.0.0.1:8000" + allPosts[i].image
            // handling likes
            let sliced_url = allPosts[i].image.slice(7)
            const likes_data = await getLike(sliced_url)
            // userPfp section
            let userPfp = await getPfp(allPosts[i].username)
            let absolute_pfp_url = 'http://127.0.0.1:8000' + userPfp.user_pfp_url
            let isDefaultPfp = userPfp.default_pfp
            if (isDefaultPfp) {
                absolute_pfp_url = 'http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png'
            }
            // to pass in values when image is enlarged
            let date_created = allPosts[i].date_created
            let date_created_converted = new Date(date_created)
            let aspect_ratio = allPosts[i].aspect_ratio
            // comments
            let comments_data = await getComments(sliced_url)
            let comment_count = comments_data.comments.length
            postsHtml.push(
                <div key={i} className="homePostContainer">
                    <div className="flex">
                        <img 
                        src={absolute_pfp_url} alt="" 
                        className="homePostsPfp" 
                        onClick={() => window.location.pathname = '/user/' + allPosts[i].username}
                        />
                        <p className="homePostsUsername" onClick={() => window.location.pathname = '/user/' + allPosts[i].username}>{allPosts[i].username}</p>
                        <LuDot className="homePostsDot"/>
                        <p className="homePostsDate">{date_created_converted.getMonth() + 1 + '/' + date_created_converted.getDate() + '/' + date_created_converted.getFullYear()}</p>
                    </div>
                    <img src={absolute_url} alt="" className="homePost"/>
                    <div className="homePostIcons">
                        {likes_data.liked === 'true'
                        ?
                        <IoMdHeart className="heartIconHome" style={{color: 'red'}} onClick={() => submitLike(sliced_url)}/>
                        :
                        <IoMdHeartEmpty className="heartIconHome" onClick={() => submitLike(sliced_url)}/>
                        }
                        
                        <IoChatbubbleOutline className="commentIconHome"
                        onClick={() => showFullImg(date_created_converted, absolute_pfp_url, absolute_url, aspect_ratio, allPosts[i].username)}/>
                    </div> 
                    {likes_data.num_of_likes === '1' ? <p className="homePostsLike">{likes_data.num_of_likes} like</p> : <p className="homePostsLike"> {likes_data.num_of_likes} likes</p>}
                    {comment_count === 0 
                    ?
                     '' 
                    :
                     comment_count === 1 
                     ?
                      <p className="homePostsCommentCount" onClick={() => showFullImg(date_created_converted, absolute_pfp_url, absolute_url, aspect_ratio, allPosts[i].username)}>View {comment_count} comment</p> 
                      :
                    <p className="homePostsCommentCount" onClick={() => showFullImg(date_created_converted, absolute_pfp_url, absolute_url, aspect_ratio, allPosts[i].username)}>View all {comment_count} comments</p>}
                </div>
            )
        }
        setAllPostsHtml(postsHtml)
    }

    // when a user clicks on the image preview, they'll get the full image
    function showFullImg(date_created_converted, absolute_pfp_url, imageUrl, aspect_ratio, user_name) {
        // so we can name the css class differently
        if (aspect_ratio === 'one_to_one'){
            setSelectedImgRatio('selectedImageOneToOne')
        }
        else{
            setSelectedImgRatio('selectedImageOriginal')
        }
        setSelectedImgDate(date_created_converted)
        setUserPfp(absolute_pfp_url)
        setSelectedImgUrl(imageUrl)
        user.username = user_name
        setShowFullImageVar(true)
    }

    return(
        <>
        <SideBar />
        <div className="homepage">
            <div className="allPostsContainer">
                {allPostsHtml}
            </div>
            {showFullImgVar && 
            <> 
                <ExpandedPost 
                showFullImgVar={showFullImgVar} setShowFullImageVar={setShowFullImageVar} 
                showImageOptionsVar={showImageOptionsVar} setShowImageOptionsVar={setShowImageOptionsVar}
                userPfp={userPfp} setUserPfp={setUserPfp} 
                selectedImgUrl={selectedImgUrl} setSelectedImgUrl={setSelectedImgUrl} 
                selectedImgRatio={selectedImgRatio} setSelectedImgRatio={setSelectedImgRatio}
                selectedImgDate={selectedImgDate} setSelectedImgDate={selectedImgDate}
                user={user} setUser={setUser}
                />
            </>
        }
        </div>
        </>
    )
}

export default Home