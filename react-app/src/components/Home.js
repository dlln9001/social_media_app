

function Home() {
    function logout() {
        localStorage.clear()
        window.location.pathname = '/'
    }
    return(
        <button onClick={logout}> Logout </button>
    )
}

export default Home