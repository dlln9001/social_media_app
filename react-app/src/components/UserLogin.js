import { useState, useEffect } from 'react'
import '../App.css'


function UserLogin() {
    const [usernameForm, setUsernameForm] = useState('')
    const [passwordForm, setPasswordForm] = useState('')
    
    function sendLoginData(event){
        event.preventDefault()
        fetch('http://127.0.0.1:8000/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameForm,
                password: passwordForm
            })
        }).then((res) => {return res.json()}
        ).then((data) => {
            localStorage.setItem('userData', JSON.stringify(data))
            setUsernameForm('')
            setPasswordForm('')
            if (JSON.parse(localStorage.getItem('userData')).detail === 'good'){
                // fetches extra data, like followers of the user, etc.
                fetch('http://127.0.0.1:8000/profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${JSON.parse(localStorage.getItem('userData')).token}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem('extraUserData', JSON.stringify(data))
                        window.location.pathname = '/home'
                    })
                    .catch(error => error)
            }
        })
    }



    useEffect(() => {
        // makes sure there's no user data already
        if (localStorage.getItem('userData')){
            localStorage.clear()
            window.location.reload()
        }
    }, [])

    let userData = JSON.parse(localStorage.getItem('userData'))
    return (
        <>
            <div className='loginBlock'>
                <form action="" onSubmit={sendLoginData} className='loginForm'>
                    <div>
                        <input type="text" id='loginUsernameId' className='userField' placeholder='Username' maxLength="30" 
                            value={usernameForm}
                            onChange={(e) => setUsernameForm(e.target.value)}
                        />
                    </div>
                    <div>
                        <input type="password" id='loginPasswordId' className='userField' placeholder='Password' maxLength="30" 
                            value={passwordForm}
                            onChange={(e) => setPasswordForm(e.target.value)}
                        />
                    </div>
                    <button className='submitLogin'><strong>Log in</strong></button>
                    {userData &&
                    <div style={{textAlign: 'center'}}>
                        <p>{userData.detail != 'good' ? 'Wrong password or username' : ''}</p>
                    </div>
                    }
                </form>
                
                <div className='noAccountRedirect'>
                    Don't have an account? <strong style={{'color':'#00BFFF'}}><a href="signup">Sign up</a></strong>
                </div>
            </div>
        </>
    )
    
}

export default UserLogin