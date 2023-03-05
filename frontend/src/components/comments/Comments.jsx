import { useContext, useState } from 'react'
import './comments.scss'
import { AuthContext } from '../../context/authContext';
import { makeRequest } from '../../axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { Link } from 'react-router-dom';
function Comments({ postId }) {
    const [desc, setDesc] = useState("");
    const { currentUser } = useContext(AuthContext);


    const { isLoading, error, data } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () =>
            makeRequest.get('/comments?postId=' + postId).then(
                (res) => res.data,
            ),
    })

    // Fake comments
    // console.log(data);
    // const Comments = [
    //     {
    //         id: 1,
    //         desc: "Lorem ipsum dolor amet consectetur ipsum dolor amet consectetur ipsum dolor amet consectetur adipisicing elit. Autem nequeaspernatur ull",
    //         name: "Prince Goyal",
    //         userId: 1,
    //         profilePicture: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1600",
    //     },
    //     {
    //         id: 2,
    //         desc: "Lorem ipsum dolor amet consectetur adipisicing elit. Autem nequeaspernatur ull",
    //         name: "Prince Goyal",
    //         userId: 2,
    //         profilePicture: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    //     },
    // ]

    const queryClient = useQueryClient();


    const mutation = useMutation({
        mutationFn: (newComment) => {
            return makeRequest.post('/comments', newComment);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['comments'] })
        },
    })

    const handleClick = async (e) => {

        mutation.mutate({
            desc,
            postId,
        });
        setDesc("");
    }
    // console.log(data);
    return (
        <div className='comments'>
            <div className='write'>
                <img src={currentUser.profilePicture} alt="" />
                <input type="text" placeholder='write a comment' value={desc} onChange={(e) => {
                    setDesc(e.target.value);
                }} />
                <button onClick={handleClick}>Send</button>
            </div>
            {error ? "something went wrong" : (isLoading ? "loading..." :
                data.map((comment) => (
                    <div className='comment'>
                        <img src={comment.profilePicture} alt="" />
                        <div className='info'>
                            <Link to={`/profile/${comment.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <span>{comment.name}</span>
                            </Link>
                            <p>{comment.desc}</p>
                        </div>
                        <span className='date'>{moment(comment.createdAt).fromNow()}</span>
                    </div>
                )))}
        </div>
    )
}

export default Comments