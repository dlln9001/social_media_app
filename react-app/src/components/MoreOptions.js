import { useRef, useEffect } from "react"

function MoreOptions(props) {
    const moreOptions = useRef(null)

    function closeMoreOptions(e) {
        if (moreOptions.current != null && !moreOptions.current.contains(e.target)) {
            props.setShowMoreOptions(false)
        }
    }

    function logOut() {
        localStorage.clear()
        window.location.pathname = '/'
    }

    useEffect(() => {
        document.addEventListener('mousedown', closeMoreOptions)
    }, [])

    return (
        <div className="moreOptions" ref={moreOptions}>
            <p className="moreOptionsElement" onClick={() => window.location.pathname = 'settings'}>Edit profile</p>
            <p className="moreOptionsElement" onClick={logOut}>Log out</p>
        </div>
    )
}

export default MoreOptions