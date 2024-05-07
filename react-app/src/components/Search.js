import '../App.css'
import { useState, useEffect, useRef } from 'react'
import SmallSideBar from './SmallSideBar'


function Search (props) {
    const [searchInput, setSearchInput] = useState('')
    const [searchedUsers, setSearchedUsers] = useState('')
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')).user)
    const searchRef = useRef(null)

    function closeSearch(e) {
        if(searchRef.current != null && !searchRef.current.contains(e.target)){
            props.setShowSearch(false)
        }
    }

    useEffect(() => {
        fetch('http://127.0.0.1:8000/search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchInput: searchInput
            })
        })
        .then(res => res.json())
        .then(data => {
            // data = {
            //    Users: [{id: ..., username: ..., first_name: ...}, {...}],
            //    Pfps: [{default_pfp: ..., user_pfp_url: ...}, {...}],
            // }
            // if no "response: no users found", then set searched users
            if (!data.response) {
                setSearchedUsers(data)
            } 
            else {
                setSearchedUsers('')
            } 
        })

        document.addEventListener('mousedown', closeSearch)

    }, [searchInput])

    let searchedUserHtml = []
    if (searchedUsers) {
        for (let i=0; i < searchedUsers.Users.length; i++) {
            let absolute_url = 'http://127.0.0.1:8000' + searchedUsers.Pfps[i].user_pfp_url
            if (searchedUsers.Pfps[i].default_pfp === true){
                absolute_url = 'http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png'
            }
            // if statement to only show people other than the user
            if (searchedUsers.Users[i].username != user.username){
                searchedUserHtml.push(
                    <div key={i} className='flex searchedUser' onClick={() => window.location.pathname = '/user/' + searchedUsers.Users[i].username}>
                        <img src={absolute_url} alt="" className='searchedUserPfp'/>
                        <div>
                            <p className='searchedUserUsername'>{searchedUsers.Users[i].username}</p>
                            <p className='searchedUserName'>{searchedUsers.Users[i].first_name}</p>
                        </div>
                    </div>
            )}
        }
    }

    return (
        <div className='search' ref={searchRef}>
            <SmallSideBar />
            <div className='searchPart'>
                <div style={{borderBottom: '1px solid #D3D3D3', paddingBottom: "5px"}}>
                    <h2 style={{margin: '20px'}}>Search</h2>
                    <form action="">
                        <input type="text" placeholder='Search' className='searchInput'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                </div>
                <div> 
                    {searchedUsers && 
                        <div>{searchedUserHtml}</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Search