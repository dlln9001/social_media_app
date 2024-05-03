import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { RiAspectRatioLine } from "react-icons/ri";
import { FaRegSquare } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { json } from "react-router-dom";

function CreatePost(props) {
    const [imagePreview, setImagePreview] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(null)
    // a css class, styles the image preview
    const [aspectRatio, setAspectRatio] = useState('imagePreview1to1')
    const [showRatios, setShowRatios] = useState(false)

    function submitPost() {
        const postData = new FormData()

        postData.append('image', uploadedImage)
        // so the backend has 'original' or 'one_to_one' instead of the css class name
        if (aspectRatio === 'imagePreview1to1') {
            postData.append('aspect_ratio', 'one_to_one')
        }
        else{
            postData.append('aspect_ratio', 'original')
        }
        const userToken = JSON.parse(localStorage.getItem('userData')).token
        fetch('http://127.0.0.1:8000/post/create/', {
            method: 'POST',
            headers: {'Authorization': `Token ${userToken}`},
            body: postData,
        })
        .then(res => res.json())
        .then(data => {window.location.reload()})
        .catch(error => console.log(error))
        props.setCreatePost(false)

    }

    // when file is uploaded, store that file in a variable
    function onFileChange(e) {
        const file = e.target.files[0]
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
        setUploadedImage(file)
    }

    // runs after the user exits from the post submitting process
    function clickOffCreate() {
        props.setCreatePost(false)
        URL.revokeObjectURL(imagePreview)
        setUploadedImage(null)
    }

    function makeOriginal() {
        setAspectRatio('imagePreviewOriginal')
        setShowRatios(false)
    }

    function makeOneToOne() {
        setAspectRatio('imagePreview1to1')
        setShowRatios(false)
    }

    return (
        <>
            <div className="changeBack" onClick={clickOffCreate}></div>
            <div className="closeCreatePost" onClick={clickOffCreate}> <IoMdClose style={{color: 'white', fontSize: '30px'}}/> </div>
            <div className="createPostDiv">
                {imagePreview 
                ? 
                <div>
                    <p className="createPostTxt" onClick={() => setShowRatios(false)}>Create new post</p>
                    <button className="submitImagePost" onClick={submitPost}>Share</button>
                    <img src={imagePreview} alt="" className={aspectRatio} onClick={() => setShowRatios(false)}/>
                    <div onClick={() => setShowRatios(true)}><RiAspectRatioLine className="selectAspectRatio"/></div>
                    {showRatios && 
                    <div className="aspectRatioDiv">
                        <p className="ratioOriginalTxt" onClick={makeOriginal}>Original <CiImageOn className="originalBox"/></p>
                        <p className="ratio1to1Txt" onClick={makeOneToOne}>1:1 <FaRegSquare className="oneToOneBox"/></p> 
                    </div>
                    }
                </div>
                : 
                    <div>
                        <p className="createPostTxt">Create new post</p>
                        <img src={process.env.PUBLIC_URL + '/images/createPostImage.png'} alt="" className="createPostImage"/>
                        <form action="">
                            <label htmlFor="imageInputId" className="imageInput">Select from computer</label>
                            <input type="file" accept="image/*" id="imageInputId" className="fileInput" onChange={onFileChange}/>
                        </form>
                    </div>
                }
            </div>
        </>
    )
}

export default CreatePost