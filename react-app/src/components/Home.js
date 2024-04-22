import SideBar from "./SideBar"
import '../App.css'


function Home() {
    function logout() {
        localStorage.clear()
        window.location.pathname = '/'
    }
    return(
        <div className="homepage">
            <SideBar />
            <button onClick={logout} style={{'height': '30px', 'marginLeft': '700px'}}> Logout </button>
        </div>
    )
}

export default Home