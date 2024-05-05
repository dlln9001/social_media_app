import '../App.css'
import { useState, useEffect  } from 'react';
import { GoHome } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import CreatePost from './CreatePost';

function SmallSideBar() {
    const [createPost, setCreatePost] = useState(false)
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [userPfp, setUserPfp] = useState('')

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
            const absolute_url = 'http://127.0.0.1:8000' + data.userPfp.user_pfp_url
            setUserPfp(absolute_url)
        })
    }, [])

    return(
    <>
        <div className="sideBarDiv">
            <a className='smallSideBarElement' href='/home'><div className='barIcon'><GoHome size={30}/></div></a>
            <a className='smallSideBarElement'><div className='barIcon'><IoSearchOutline size={30}/></div></a>
            <a className='smallSideBarElement' onClick={showCreatePost}><div className='barIcon'><IoCreateOutline size={30}/></div></a>
            <a className='smallSideBarElement' href='/profile'> { userPfp ? <img src={userPfp} alt="" className='barPfp barIcon'/> : <div className='barPfp barIcon'></div>}</a>
        </div>
        {createPost && <CreatePost createPost={createPost} setCreatePost={setCreatePost}/>}
    </>
    )
}

export default SmallSideBar