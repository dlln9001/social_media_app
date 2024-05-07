import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react'
import UserSignup from './components/UserSignup';
import UserLogin from './components/UserLogin';
import Home from './components/Home';
import Profile from './components/Profile';
import UserSettings from './components/UserSettings';


function App() {
  const [userData, setUserData] = useState('')
  fetch('http://127.0.0.1:8000/auth/')
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch(error => {
      console.error("Error fetching data: ", error)
    })
  

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="signup" element={<UserSignup/>} />
        <Route path='/' element={<UserLogin/>}/>
        <Route path='home' element={<Home />}/>
        <Route path='settings' element={<UserSettings />}/>
        <Route path='user/:username' element={<Profile />}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
