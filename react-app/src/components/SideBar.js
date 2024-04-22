import '../App.css'

function SideBar() {
    return (
        <div className="sideBarDiv">
            <a className='sideBarElement' href='/home'>Home</a>
            <a className='sideBarElement'>Create</a>
            <a className='sideBarElement' href='/profile'>Profile</a>
        </div>
    )
}

export default SideBar