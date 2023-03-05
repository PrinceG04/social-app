
// import { private_safeColorChannel } from '@mui/system';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import './update.scss';
import { makeRequest } from '../../axios';
const Update = ({ setOpenUpdate, user }) => {
    console.log(user);
    const [profilePic, setProfilePic] = useState(null);
    const [coverPic, setCoverPic] = useState(null);

    const [texts, setTexts] = useState({
        email: user.email,
        password: user.password,
        name: user.name,
        city: user.city,
        website: user.website,
    });
    // console.log(texts);
    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }


    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    // console.log(texts);
    const queryClient = useQueryClient();


    const mutation = useMutation({
        mutationFn: (user) => {
            // console.log(user);
            return makeRequest.put('/users', user);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })

    const handleClick = async (e) => {
        e.preventDefault();
        let profileUrl = user.profilePicture;
        let coverUrl = user.coverPicture;
        if (profilePic) profileUrl = await upload(profilePic);
        if (coverPic) coverUrl = await upload(coverPic);
        mutation.mutate({
            ...texts,
            profilePicture: profileUrl,
            coverPicture: coverUrl,
        });
        setTexts({
            email: user.email,
            password: user.password,
            name: user.name,
            city: user.city,
            website: user.website,
        });
        setOpenUpdate(false);
        setCoverPic(null);
        setProfilePic(null);
    }
    // console.log(user)
    return (
        <div className="update">
            <div className="wrapper">
                <h1>Update Your Profile</h1>
                <form>
                    <div className="files">
                        <label htmlFor="cover">
                            <span>Cover Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        coverPic
                                            ? URL.createObjectURL(coverPic)
                                            : "/upload/" + user.coverPicture
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="cover"
                            style={{ display: "none" }}
                            onChange={(e) => setCoverPic(e.target.files[0])}
                        />
                        <label htmlFor="profile">
                            <span>Profile Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        profilePic
                                            ? URL.createObjectURL(profilePic)
                                            : "/upload/" + user.profilePicture
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profile"
                            style={{ display: "none" }}
                            onChange={(e) => setProfilePic(e.target.files[0])}
                        />
                    </div>
                    <label>Email</label>
                    <input
                        type="text"
                        value={texts.email}
                        name="email"
                        onChange={handleChange}
                    />
                    <label>Password</label>
                    <input
                        type="text"
                        value={texts.password}
                        name="password"
                        onChange={handleChange}
                    />
                    <label>Name</label>
                    <input
                        type="text"
                        value={texts.name}
                        name="name"
                        onChange={handleChange}
                    />
                    <label>Country / City</label>
                    <input
                        type="text"
                        name="city"
                        value={texts.city}
                        onChange={handleChange}
                    />
                    <label>Website</label>
                    <input
                        type="text"
                        name="website"
                        value={texts.website}
                        onChange={handleChange}
                    />
                    <button onClick={handleClick}>Update</button>
                </form>
                <button className="close" onClick={() => setOpenUpdate(false)}>
                    close
                </button>
            </div>
        </div>
    )
}

export default Update