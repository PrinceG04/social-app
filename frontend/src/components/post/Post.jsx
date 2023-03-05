import './post.scss';

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import Comments from '../comments/Comments';
import { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { makeRequest } from '../../axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';

function Post({ post }) {
    const [menuOpen, setMenuOpen] = useState(false);
    // // TEMPORARY DATA
    // const liked = true;

    const { currentUser } = useContext(AuthContext);
    // console.log(currentUser.id);

    const { isLoading, error, data } = useQuery({
        queryKey: ['likes', post.id],
        queryFn: () =>
            makeRequest.get('/likes?postId=' + post.id).then(
                (res) => res.data,
            ),
    })


    const queryClient = useQueryClient();


    const mutation = useMutation({
        mutationFn: (liked) => {
            // console.log(liked);
            if (liked) return makeRequest.delete('/likes?postId=' + post.id);
            return makeRequest.post('/likes', { postId: post.id });
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['likes'] })
        },
    })
    const deleteMutation = useMutation({
        mutationFn: (postId) => {
            // console.log(liked);
            return makeRequest.delete('/posts/' + postId);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const handleClick = async (e) => {

        mutation.mutate(data.includes(currentUser.id));
    }
    const [commentOpen, setCommentOpen] = useState(false);


    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    }


    const moreViewRef = useRef(null);
    const deleteBtnRef = useRef(null);
    function handleClickOutside(event) {
        if (moreViewRef.current && !moreViewRef.current.contains(event.target) && deleteBtnRef.current != event.target) {
            // clicked outside component
            setMenuOpen(false);
        }
    }
    useEffect(() => {


        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [moreViewRef, deleteBtnRef]);



    return (
        <div className='post'>
            <div className='container'>
                <div className='user'>
                    <div className='userInfo'>
                        <img src={post.profilePicture} alt="" />
                        <div className='details'>
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <span className='name'>{post.name}</span>
                            </Link>
                            <span className='date'>{post.createdAt ? moment(post.createdAt).fromNow() : "a long ago"}</span>
                        </div>
                    </div>
                    <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} name='more' ref={moreViewRef} />
                    {menuOpen && post.userId == currentUser.id && (<button onClick={handleDelete} ref={deleteBtnRef}>delete</button>)}
                </div>
                <div className='content'>
                    <p>{post.desc}</p>
                    <img src={"/uploads/" + post.image} alt="" />
                </div>
                <div className='info'>
                    <div className='item' onClick={handleClick}>
                        {isLoading ? "Loading..." : data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{ color: "red" }} /> : <FavoriteBorderOutlinedIcon />}
                        {isLoading ? "0" : data.length} Likes
                    </div>
                    <div className='item' onClick={() => { setCommentOpen(!commentOpen) }}>
                        <TextsmsOutlinedIcon />
                        Comments
                    </div>
                    <div className='item'>
                        <ShareOutlinedIcon />
                        Share
                    </div>

                </div>
                {commentOpen && <Comments postId={post.id} />}

            </div>
        </div>



    )
}

export default Post