import { useEffect, useState } from "react"
import SideBar from "./SideBar"
import ChangePfp from "./ChangePfp"

function UserSettings() {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userData')))
    const [extraUserInfo, setExtraUserInfo] = useState(JSON.parse(localStorage.getItem('extraUserData')))
    const [userPfp, setUserPfp] = useState('')
    const [bioText, setBioText] = useState(extraUserInfo.extraUserData.bio)
    const [nameText, setNameText] = useState(userInfo.user.first_name)
    const [usernameText, setUsernameText] = useState(userInfo.user.username)
    const [usernameTaken, setUsernameTaken] = useState(false)
    const [showPfpOptionsVar, setShowPfpOptionsVar] = useState(false)
    
    // gets profile picture
    useEffect(() => {
        fetch('http://127.0.0.1:8000/profile/getpfp/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`},
        })
        .then(res => res.json())
        .then(data => {
            if (data.userPfp.default_pfp === true) {
                setUserPfp('http://127.0.0.1:8000/media/images/profile_pictures/Default_pfp.png')
            }
            else{
                const absolute_url = 'http://127.0.0.1:8000' + data.userPfp.user_pfp_url
                setUserPfp(absolute_url)
            }
        })
    }, [])

    // we submit the form, and set local storage to new values
    function submitProfile(e) {
        e.preventDefault()
        fetch('http://127.0.0.1:8000/settings/editprofile/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bio_text: bioText,
                name_text: nameText,
                username_text: usernameText,
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setUsernameTaken(true)
            }
            else {
                extraUserInfo.extraUserData.bio = data.bio_text
                userInfo.user.first_name = data.name_text
                userInfo.user.username = data.username_text
                localStorage.setItem('userData', JSON.stringify(userInfo))
                localStorage.setItem('extraUserData', JSON.stringify(extraUserInfo))
                setUsernameTaken(false)
                window.location.reload()
            }
        })
    }

    return (
        <>
        <SideBar />
        {showPfpOptionsVar && <div className="changeBack" onClick={() => setShowPfpOptionsVar(false)}></div>}
        {showPfpOptionsVar && <ChangePfp showPfpOptionsVar={showPfpOptionsVar} setShowPfpOptionsVar={setShowPfpOptionsVar}/>}
        <div className="editProfilePage">
            <h2>Edit Profile</h2>
            <div className="settingsProfileContainer">
                <img src={userPfp} alt="" className="settingsPfp" onClick={() => setShowPfpOptionsVar(true)}/>
                <div>
                    <p className="settingsUsernameOverview">{userInfo.user.username}</p>
                    <p className="settingsNameOverview">{userInfo.user.first_name}</p>
                </div>
                <button className="settingsChangePfp" onClick={() => setShowPfpOptionsVar(true)}>Change Photo</button>
            </div>
            <form action="" onSubmit={submitProfile}>
                <h4>Bio</h4>
                <p className="bioTextLimit">{bioText.length}/150</p>
                <textarea maxLength="150" className="bioSettingsTextArea" value={bioText} onChange={(e) => setBioText(e.target.value)}></textarea>
                <div style={{display: 'flex'}}>
                    <div>
                        <h4>Name</h4>
                        <input type="text" className="nameSettingsText" maxLength="30" value={nameText} onChange={(e) => setNameText(e.target.value)}/>
                    </div>
                    <div>
                        <h4>Username</h4>
                        <input type="text" className="nameSettingsText" maxLength="30" value={usernameText} onChange={(e) => setUsernameText(e.target.value)}/>
                    </div>
                </div>
                {usernameTaken &&
                <p>Username Already Taken</p>
                }
                <br />
                <button className="submitSettings">Submit</button>
            </form>
        </div>
        </>
    )
}   

export default UserSettings