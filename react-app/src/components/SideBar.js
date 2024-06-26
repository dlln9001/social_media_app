import { useState, useEffect, useRef } from 'react'
import '../App.css'
import Search from './Search'
import CreatePost from './CreatePost'
import { GoHome } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import MoreOptions from './MoreOptions';
import { IoIosAddCircleOutline } from "react-icons/io";


function SideBar() {
    const [showSearch, setShowSearch] = useState(false)
    const [createPost, setCreatePost] = useState(false)
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [userPfp, setUserPfp] = useState('')
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')).user)
    const [showMoreOptions, setShowMoreOptions] = useState(false)

    function openSearch() {
        setShowSearch(true)
    }



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
            if (data.userPfp.default_pfp === true) {
                setUserPfp('http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png')
            }
            else {
                const absolute_url = 'http://127.0.0.1:8000' + data.userPfp.user_pfp_url
                setUserPfp(absolute_url)
            }
        })

    }, [])

    return (
        <>
            <div className="sideBarDiv">
                <a className='sideBarElement' href='/home'> <div className='barIcon'><GoHome size={30}/></div> <p>Home</p> </a>
                <a className='sideBarElement' onClick={openSearch}> <div className='barIcon'><IoSearchOutline size={30}/></div> <p>Search</p></a>
                <a className='sideBarElement' onClick={showCreatePost}> <div className='barIcon'><IoIosAddCircleOutline size={30}/></div> <p>Create</p></a> 
                <a className='sideBarElement' onClick={() => window.location.pathname = '/user/' + user.username}> { userPfp ? <img src={userPfp} alt="" className='barPfp barIcon'/> : <div className='barPfp barIcon'></div>}<p>Profile</p></a>
                <a className='sideBarElement sideBarMore' onClick={() => setShowMoreOptions(true)}><div className='barIcon'><RxHamburgerMenu size={30}/></div><p>More</p></a>
                {showMoreOptions && <MoreOptions showMoreOptions={showMoreOptions} setShowMoreOptions={setShowMoreOptions}/>}
            </div>
            {showSearch && <Search showSearch={showSearch} setShowSearch={setShowSearch}/>}
            {createPost && <CreatePost createPost={createPost} setCreatePost={setCreatePost}/>}
        </>
    )
}

export default SideBar