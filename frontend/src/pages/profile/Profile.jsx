import "./profile.scss"

import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone';
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from "@mui/icons-material/Pinterest"
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useId, useState } from "react";
const Profile = () => {
  const [openUpdate,setOpenUpdate] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  // console.log(userId);
  const { isLoading, error, data } = useQuery({
    queryKey: ['user',userId],
    queryFn: () =>
      makeRequest.get('/users/find/' + userId).then(
        (res) => res.data,
      ),
  })



  const {isLoading:rIsLoading,data:relationshipData } = useQuery({
    queryKey: ['relationships', userId],
    queryFn: () =>
      makeRequest.get('/relationships?followedUserId=' + userId).then(
        (res) => res.data,
      ),
  })
  // console.log(relationshipData);
  // console.log(userId == currentUser.id);
  // console.log(userId === currentUser.id);
  // console.log(typeof useId, typeof currentUser.id);
  // console.log(data);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (followed) => {
      // console.log(liked);
      if (followed) return makeRequest.delete('/relationships?userId=' + userId);
      return makeRequest.post('/relationships', { userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['relationships'] })
    },
  })

  const handlefollow = async (e) => {

    mutation.mutate(relationshipData.includes(currentUser.id));
  }
  return (
    <div className="profile">
      {isLoading ? "Loading" : <>
        <div className="images">
          <img src={data.coverPicture ? data.coverPicture : "https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1600"} className="cover" />
          <img src={data.profilePicture ? data.profilePicture : "https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600"} className="profilePicture" />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon/>
              </a>
            </div>
            <div className="center">
              <span>{data.name}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{data.city}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{data.website}</span>
                </div>
              </div>
              {rIsLoading?"Loading":userId === currentUser.id ?<button onClick={()=>setOpenUpdate(true)}>update</button> :<button onClick={handlefollow}>
              {relationshipData.includes(currentUser.id)?"following":"follow"}
              </button>}
              
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts userId={userId}/>
        </div>
      </>}
    {openUpdate&&<Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  )
}

export default Profile