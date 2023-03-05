
import Post from '../post/Post';
import './posts.scss';
import { makeRequest } from '../../axios.js';
import { useQuery } from '@tanstack/react-query';
function Posts({userId}) {

    const { isLoading, error, data } = useQuery({
        queryKey: ['posts'],
        queryFn: () =>
            makeRequest.get('/posts?userId='+userId).then(
                (res) => res.data,
            ),
    })
   

    // const posts = [
    //     {
    //         id: 1,
    //         name: "Nikhil Singh",
    //         userId: 1,
    //         profilePicture: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    //         desc: "Tenetur iste ispum dolor amet consectetur adipisicing elit no",
    //         img:"https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
    //     },
    //     {
    //         id:2,
    //         name: "Nikhil Singh",
    //         userId: 1,
    //         profilePicture: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    //         desc:"Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim no"
    //     },
    // ]

    return (
        <div className='posts'>
            {error?'Something went wrong':(isLoading?'Loading....': data.map(post => (
                <Post post={post} key = {post.id}/>
            )))}
        </div>
    )
}

export default Posts