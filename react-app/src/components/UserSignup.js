import { useState, useEffect } from 'react'
import '../App.css'


function UserSignup() {
    const [usernameForm, setUsernameForm] = useState('')
    const [passwordForm, setPasswordForm] = useState('')

    function sendSignupData(event) {
        event.preventDefault()
        fetch('http://127.0.0.1:8000/auth/signup/', {
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
            if (JSON.parse(localStorage.getItem('userData')).username != 'A user with that username already exists.'){
                // fetches extra data, like followers of the user, etc.
                fetch('http://127.0.0.1:8000/profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${JSON.parse(localStorage.getItem('userData')).token}`
                    },
                    body: JSON.stringify({
                        user_name: JSON.parse(localStorage.getItem('userData')).user.username
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem('extraUserData', JSON.stringify(data))
                        window.location.pathname = '/home'
                    })
                    .catch(error => error)
            }
    })}

    useEffect(() => {
        // makes sure there's no user data already
        if (localStorage.getItem('userData')){
            localStorage.clear()
            window.location.reload()
        }
    }, [])

    let userData = JSON.parse(localStorage.getItem('userData'))
    console.log('userData: ', JSON.parse(localStorage.getItem('userData')))
    return (
        <>
            <div className='loginBlock'>
                <form action="" onSubmit={sendSignupData} className='loginForm'>
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
                    <button className='submitLogin'><strong>Sign up</strong></button>
                    {userData &&
                    <div style={{textAlign: 'center'}}>
                        <p>{userData.username === 'A user with that username already exists.' ? 'Username Already Taken' : ''}</p>
                    </div>
                    }
                </form>
                
                <div className='noAccountRedirect'>
                    Have an account? <strong style={{'color':'#00BFFF'}}><a href="/">Log in</a></strong>
                </div>
            </div>
        </>
    )
}

export default UserSignup