import React, {useState, useEffect} from 'react';
import { Link, Head } from '@inertiajs/react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import GridViewIcon from '@mui/icons-material/GridView';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CreateFacultyModal from '@/Components/AdminComponents/CreateFacultyModal';
import ImportStudentsModal from '@/Components/AdminComponents/ImportStudentsModal';
import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown';
import SearchIcon from '@mui/icons-material/Search'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchBar from '@/Components/AdminComponents/SearchBar';
import AutoCompleteSearch from '@/Components/AdminComponents/AutoCompleteSearch';
import ApplicationLogo from '../ApplicationLogo';
import Avatar from '@mui/material/Avatar';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function SideBar({auth}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const profilePicPath = "http://localhost:8000/storage/profile_pics"; 
  const [loading, setLoading] = useState(false);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{backgroundColor: '#6366f1'}}>
      <Toolbar className="flex items-center justify-between">
  <div className="flex items-center">
    <IconButton
      color="black"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      sx={{ mr: 2, ...(open && { display: 'none' }) }}
    >
      <MenuIcon style={{ color: '#fff' }} />
    </IconButton>
    <Typography variant="h6" noWrap component="div">
    {/* <SearchBar auth={auth}/> */}
    <AutoCompleteSearch auth={auth}/>
    {/* <MaterialAutoComplete/> */}


{loading && (
  <div className="animate-bounce" style={{ animationDuration: '2s' }}>
    
    Loading...
  </div>
)}


    </Typography>
   
  </div>

  <div className="flex items-center">
    {auth.role === 'Admin' && (
      <>
        <div className="mr-3 inline-block">
          <ImportStudentsModal />
        </div>
        <CreateFacultyModal />
      </>
    )}
    <Dropdown>
      <Dropdown.Trigger>
      <span className="inline-flex rounded-md m-3 hover:cursor-pointer">
        {!auth.profile_pic ? <Avatar {...stringAvatar(auth.name)} sx={{width: 56, height: 56}}/> : <Avatar alt="Profile Picture" src={`${profilePicPath}/${auth.profile_pic}`} sx={{width: 56, height: 56}}/> }
      {/* {!auth.profile_pic ? auth.name : <img src={`${profilePicPath}/${auth.profile_pic}`} className="inline-block h-10 w-10 rounded-full ring-2 ring-white hover:ring-black"/> } */}

   
  </span>
      <Dropdown.Content>
      <Dropdown.Link href={route('faculty.logout')} method="post" as="button">
       <LogoutOutlinedIcon/>  Log Out
     </Dropdown.Link>
      </Dropdown.Content>
      </Dropdown.Trigger>
    </Dropdown>
  
  </div>
</Toolbar>

      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <ApplicationLogo/>
        {/* <h6 className="font-normal text-indigo-500 text-start m-3 text-xl">My Role: {auth.role}</h6>    */}
        <Divider />

        <Divider />
        <List>
        <ListItem key="dash" disablePadding style={{
       backgroundColor: route().current('faculty.dash') ? '#6366f1' : '', color: route().current('faculty.dash') ? '#fff' : '#000'}}>
              <ListItemButton component={Link} to={route('faculty.dash')}>
                <ListItemIcon>
                <GridViewIcon style={{color: route().current('faculty.dash') ? '#fff' : '#000'}}/>
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            <ListItem key="profile" disablePadding style={{
       backgroundColor: route().current('faculty.profile') ? '#6366f1' : '', color: route().current('faculty.profile') ? '#fff' : '#000'}}>
              <ListItemButton component={Link} to={route('faculty.profile')}>
                <ListItemIcon>
                <AccountCircleOutlinedIcon style={{color: route().current('faculty.profile') ? '#fff' : '#000'}}/>
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>

        </List>
        <p className="text-start m-3 font-semibold">App Version <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-md font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Beta</span></p>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      
      </Main>
    </Box>
  );
}