import '../App.css'
import { useState, useEffect } from 'react'
import SmallSideBar from './SmallSideBar'


function Search () {
    const [searchInput, setSearchInput] = useState('')
    const [searchedUsers, setSearchedUsers] = useState('')

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
            // if no "response: no users found", then set searched users
            if (!data.response) {
                setSearchedUsers(data)
            } 
            else {
                setSearchedUsers('')
            } 
        })
    }, [searchInput])
    console.log(searchedUsers.Users)
    return (
        <div className='search'>
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
                        searchedUsers.Users.map((user, i) => {
                            return (
                                <div className='searchedUser' key={i}>{user}</div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Search