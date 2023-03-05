import "./navBar.scss"
import { Link, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

function NavBar() {
  const navigate = useNavigate();
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);

  // const handleLogout = async() =>{
  //   console.log("logout");
  //   try{
  //     console.log("logout successfully.");
  //   }
  //   catch(err){
  //     console.log(err.response.data);
  //   }
  // }

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login")
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className='navBar'>
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>socialnow</span>
        </Link>
        <HomeOutlinedIcon />
        {!darkMode ? <DarkModeOutlinedIcon onClick={toggle} /> : <WbSunnyOutlinedIcon onClick={toggle} />}
        <GridViewOutlinedIcon />
        <div class="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <LogoutIcon style={{ cursor: 'pointer' }} onClick={handleLogout} />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img src={currentUser.profilePicture} alt="" />

          {/* <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
            <span className='name'>{post.name}</span>
          </Link> */}
          <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>{currentUser.name}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NavBar