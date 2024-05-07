import '../App.css'
import { useState, useEffect  } from 'react';
import { GoHome } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import CreatePost from './CreatePost';
import { RxHamburgerMenu } from "react-icons/rx";
import MoreOptions from './MoreOptions';
import { Link } from 'react-router-dom';

function SmallSideBar() {
    const [createPost, setCreatePost] = useState(false)
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')).user)
    const [userPfp, setUserPfp] = useState('')
    const [showMoreOptions, setShowMoreOptions] = useState(false)

    function showCreatePost() {
        setCreatePost(true)
    }

    // gets user pfp
    useEffect(() => {
        fetch('http://127.0.0.1:8000/profile/getpfp/', {
            method: "POST",
            headers: {'Authorization': `Token ${userToken}`},
        })
        .then(res => res.json())
        .then(data => {
            // data = {
            //     userPfp: {user_pfp_url: ..., default_pfp: ...}
            // }
            let absolute_url = 'http://127.0.0.1:8000' + data.userPfp.user_pfp_url
            if (data.userPfp.default_pfp === true) {
                absolute_url = 'http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png'
            }
            setUserPfp(absolute_url)
        })
    }, [])

    return(
    <>
        <div className="sideBarDiv">
            <a className='smallSideBarElement' href='/home'><div className='barIcon'><GoHome size={30}/></div></a>
            <a className='smallSideBarElement'><div className='barIcon'><IoSearchOutline size={30}/></div></a>
            <a className='smallSideBarElement' onClick={showCreatePost}><div className='barIcon'><IoIosAddCircleOutline size={30}/></div></a>
            <Link className='smallSideBarElement' to={'/user/' + user.username}> { userPfp ? <img src={userPfp} alt="" className='barPfp barIcon'/> : <div className='barPfp barIcon'></div>}</Link>
            <a className='smallSideBarElement sideBarMore' onClick={() => setShowMoreOptions(true)}><div className='barIcon'><RxHamburgerMenu size={30}/></div></a>
                {showMoreOptions && <MoreOptions showMoreOptions={showMoreOptions} setShowMoreOptions={setShowMoreOptions}/>}
        </div>
        {createPost && <CreatePost createPost={createPost} setCreatePost={setCreatePost}/>}
    </>
    )
}

export default SmallSideBar