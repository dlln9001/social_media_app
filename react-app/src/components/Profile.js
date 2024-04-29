import SideBar from "./SideBar"


function Profile() {

    function fetchExtra() {
        fetch('http://127.0.0.1:8000/profile/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    userId: JSON.parse(localStorage.getItem('userData')).user.id
                })
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('extraUserData', JSON.stringify(data))
                window.location.reload()
            })
    }
    
    if (!localStorage.getItem('extraUserData')){
        fetchExtra()
    }

    let user = ''
    if (localStorage.getItem('userData')) {
        user = JSON.parse(localStorage.getItem('userData')).user
    }
    let extraUser = false
    if (localStorage.getItem('extraUserData')) {
        extraUser = JSON.parse(localStorage.getItem('extraUserData')).extraUserData
    }


    return (
        <div className="homepage">
            <SideBar />
            {extraUser && 
            <div className="profileOverview">
                <p style={{fontSize: '25px'}}>{user.username}</p>
                <p>{extraUser.followers.length} Followers</p>
                <p>{extraUser.followers.length} Following</p>
                <p>{extraUser.bio ? extraUser.bio : ''}</p>
            </div>
            }
        </div>
    )
}

export default Profile