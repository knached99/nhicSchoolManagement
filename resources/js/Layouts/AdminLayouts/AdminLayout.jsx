import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GridViewIcon from '@mui/icons-material/GridView';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CreateFacultyModal from '@/Components/AdminComponents/CreateFacultyModal';
import ImportStudentsModal from '@/Components/AdminComponents/ImportStudentsModal';
import SideBar from '@/Components/AdminComponents/SideBar';
import Zoom from '@mui/material/Zoom';

export default function AdminLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const wallpaperPicPath = "http://localhost:8000/storage/wallpaper_pics";
    
    const backgroundStyle = user.wallpaper_pic
    ? {
        backgroundImage: `url(${wallpaperPicPath}/${user.wallpaper_pic})`,
        backgroundSize: 'cover', 
        /* contain -> Resizes the background image to make sure it is fully visible	
           Cover -> Resizes the background image to cover the entire container, even if it has to stretch the image or cut a little bit off one of the edges	
        */
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : null;
      
  

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900" style={backgroundStyle}>

            
            <SideBar auth={user}/>

            <main>{children}</main>
        </div>
        
    );
}
