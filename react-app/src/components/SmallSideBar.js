import '../App.css'
import { useState  } from 'react';
import { GoHome } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import CreatePost from './CreatePost';

function SmallSideBar() {
    const [createPost, setCreatePost] = useState(false)
    function showCreatePost() {
        setCreatePost(true)
    }
    return(
    <>
        <div className="sideBarDiv">
            <a className='smallSideBarElement' href='/home'><div className='barIcon'><GoHome size={30}/></div></a>
            <a className='smallSideBarElement'><div className='barIcon'><IoSearchOutline size={30}/></div></a>
            <a className='smallSideBarElement' onClick={showCreatePost}><div className='barIcon'><IoCreateOutline size={30}/></div></a>
            <a className='smallSideBarElement' href='/profile'><div className='barIcon'><CgProfile size={30}/></div></a>
        </div>
        {createPost && <CreatePost createPost={createPost} setCreatePost={setCreatePost}/>}
    </>
    )
}

export default SmallSideBar