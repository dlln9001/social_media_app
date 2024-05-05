import { useState } from "react"

function ChangePfp(props) {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userData')).token)

    function changePfp(e) {
        const pfpFile = new FormData()
        pfpFile.append('pfp_file', e.target.files[0])
        fetch('http://127.0.0.1:8000/profile/uploadpfp/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`},
            body: pfpFile,
        })
        .then(res => res.json())
        .then(data => window.location.reload())
    }

    function removePfp() {
        fetch('http://127.0.0.1:8000/profile/removepfp/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`},
        })
        .then(res => res.json())
        .then((data) => {
            window.location.reload()
        })
    }
    
    return (
        <div className="pfpOptions">
        <p style={{padding: '10px'}}>Change Profile Photo</p>
        <form action="" className="pfpOptionsForm">
            <label className="pfpImageInputLabel" htmlFor="pfpImageInput"><p style={{color: '#00BFFF', margin: '0px'}}>Upload Photo</p></label>
            <input type="file" className="fileInput" accept="image/*" id="pfpImageInput" onChange={changePfp}/>
        </form>
        <div className="pfpOptionsTxt" onClick={removePfp}><p className="pfpRemoveCurrentPhoto">Remove Current Photo</p></div>
        <p className="pfpOptionsTxt" onClick={() => props.setShowPfpOptionsVar(false)}>Cancel</p>
    </div>
    )
}

export default ChangePfp