import Header from './Header';
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../reducers/Post/action";
import { storage } from './firebase';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function Post() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const state = useSelector((state) => {
        console.log(state)
        return {
            user: state.usersReducer.user,
            token: state.usersReducer.token
        }
    })

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");


    const [image, setImage] = useState(null);
    const [url, setUrl] = useState();
    const [progress, setProgress] = useState(0);

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleOption = (e) => {
        setCountry(e.target.value);
    };

    const handlePublish = (e) => {
        e.preventDefault();

        const data = {
            title: title,
            description: description,
            country: country,
            image: url,
            user:{
                username: state.user.userName
            },

        };
        console.log(data);
        console.log(state.token);

        axios
          .post(`http://localhost:8080/experience`, data)
          .then((res) => {
              console.log(res.data);
              const action = addPost(res.data)
              dispatch(action);

            Swal.fire({
              icon: 'success',
              className: "pop-up",
              title: 'Your post has been added',
              showConfirmButton: false,
              timer: 1500
              })

              navigate("/experience")
          })
          .catch((err) => {
              console.log(err);
          });
    };

        const handleChange = e => {
            if(e.target.files[0]){
                setImage(e.target.files[0]);
            }
        };

        const handleUpload = (e) => {
            e.preventDefault()
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                       .ref("images")
                       .child(image.name)
                       .getDownloadURL()
                       .then(url => {
                           console.log(url);
                           setUrl(url);
                       });
                }
                );
        };

    return (
        <>
        <Header/>
        <div className="post">
                 <h1 id="post-title">Write a travel guide</h1>
                 <h6 id="post-form">Help fellow travelers by writing up your past itinerary.</h6>
        
            <form className="guide">
                <input 
                   className="input1"
                   type="text"
                   placeholder="Title"
                   name="title"
                //    value={title}
                   onChange={handleTitle}
                />

                <select id="counrty" className="input2" onChange={handleOption}>
                    <option value="hide"> Country </option>
                    <option value="Riyadh">Riyadh</option>
                    <option value="London">London</option>
                    <option value="Spain">Spain</option>
                    <option value="Korea">Korea</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Jeddah">Jeddah</option>
                    <option value="Paris">Paris</option>
                    <option value="Japan">Japan</option>
                    <option value="Italia">Italia</option>
                    <option value="Hawaii">Hawaii</option>
                    <option value="India">India</option>
                </select>

                <textarea
                   className="input3"
                   type="text"
                   placeholder="Tell us your experience..."
                   name="description"
                //    value={description}
                   onChange={handleDescription}
                />

                <button 
                   className="publish"
                   onClick={handlePublish}
                >
                    Publish
                </button>

                {/* <progress className="upload-line" value={progress} max="100" /> */}

            <div className="fileUpload" >
                <label htmlFor="up0" className="hovertext" data-hover="Click here to choose an image"><i class="fa fa-plus" aria-hidden="true" ></i> </label>
                {/* <i class="fa fa-plus" aria-hidden="true" ></i> */}
                <input type="file" id="up0" onChange={handleChange}/>
            </div>
            <div className="icon-style">
                <button 
                   className="hovertext"
                   data-hover="Click here to download the image"
                   onClick={handleUpload}
                >
                 <i class="fa fa-picture-o" aria-hidden="true"></i>
                </button>
            </div>
                <br />
                <img src={url} className="post-img"/>
            </form>
        </div>
        {/* || "http://via.placeholder.com/300x400" */}
        {/* alt="firebase-image" */}
        </>
    )
}

export default Post;

