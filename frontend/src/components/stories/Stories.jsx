import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import './stories.scss';

function Stories() {
    const {currentUser} = useContext(AuthContext);

    const stories = [
        {
            id: 1,
            name: "Nikhil Negi",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600"
        },
        {
            id: 1,
            name: "Nikhil Negi",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600"
        },
        {
            id: 1,
            name: "Nikhil Negi",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600"
        },
        {
            id: 1,
            name: "Nikhil Negi",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600"
        },
       
    ]

    return (
        <div className='stories'>
            <div className='story'>
                <img src={currentUser.profilePicture} alt="" />
                <span>{currentUser.name}</span>
                <button>+</button>
            </div>
            {
                stories.map(story => (
                    <div className='story' key={story.id}>
                        <img src={story.img} alt=""/>
                        <span>{story.name}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default Stories