import { useState } from 'react'
import '../App.css'
import Search from './Search'
import { GoHome } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


function SideBar() {
    const [showSearch, setShowSearch] = useState(false)
    function openSearch() {
        setShowSearch(true)
    }
    return (
        <>
            <div className="sideBarDiv">
                <a className='sideBarElement' href='/home'> <div className='barIcon'><GoHome size={30}/></div> <p>Home</p> </a>
                <a className='sideBarElement' onClick={openSearch}> <div className='barIcon'><IoSearchOutline size={30}/></div> <p>Search</p></a>
                <a className='sideBarElement'> <div className='barIcon'><IoCreateOutline size={30}/></div> <p>Create</p></a>
                <a className='sideBarElement' href='/profile'> <div className='barIcon'><CgProfile size={30}/></div><p>Profile</p></a>
            </div>
            {showSearch && <Search />}
        </>
    )
}

export default SideBar