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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { debounce } from 'lodash';


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
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
const [searchQuery, setSearchQuery] = useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const initialValues = {
    search: ''
  };

  const validationSchema = Yup.object().shape({
    search: Yup.string().required('Search query is required')
  });



  const AutocompleteContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const AutocompleteSearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const AutocompleteStyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));


  const autoCompleteSearch = async () => {
    try {
      console.log('Searching...');
      setLoading(true);
      const response = await axios.get(`/search?query=${searchQuery}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.errors) {
        console.log(response.data.errors);
        setError(response.data.errors);
        setSearchResults([]);
      } else {
        console.log(response.data.results);
        setSearchResults(response.data.results);
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message || 'Unable to complete search, something went wrong');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    autoCompleteSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  const debouncedAutoCompleteSearch = debounce(autoCompleteSearch, 1000); // Adjust the delay (in milliseconds) as needed

  useEffect(() => {
    if (searchQuery) {
      debouncedAutoCompleteSearch(); // It will wait for 500 milliseconds of inactivity before triggering autoCompleteSearch

    }
  }, [searchQuery]);

  

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
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={autoCompleteSearch}>
    {({
                        values,
                        errors,
                        touched,
                        handleSubmit,
                        handleBlur,
                        handleChange,
                        isValid,
                        dirty,
                        isSubmitting,
                      }) => (
        <Form onSubmit={handleSubmit} autoComplete="off">
          <AutocompleteContainer>
            <AutocompleteSearchIconWrapper>
              <SearchIcon />
            </AutocompleteSearchIconWrapper>
            <Field
              name="search"
              id="search"
              component={AutocompleteStyledInputBase}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              options={searchResults}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} />}
              // onChange={(e) => {
              //   setSearchQuery(e.target.value);
              //   setFieldValue('search', e.target.value);
              // }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.search && Boolean(errors.serach)}
            
            />
          </AutocompleteContainer>
          {/* Your other form fields go here */}
        </Form>
      )}
    </Formik>
    {searchResults && 
    <div>
      {searchResults}
      </div>
    }


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
      {!auth.profile_pic ? auth.name : <img src={`${profilePicPath}/${auth.profile_pic}`} className="inline-block h-10 w-10 rounded-full ring-2 ring-white hover:ring-black"/> }

      {/* <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
      >
           {!auth.profile_pic ? auth.name : <img src={`${profilePicPath}/${auth.profile_pic}`} class="inline-block h-10 w-10 rounded-full ring-2 ring-white"/> }
                                            
          <svg
                className="ms-2 -me-0.5 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
          >
              <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
              />
          </svg>
      </button> */}
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
        <h6 className="font-normal text-indigo-500 text-start m-3 text-xl">My Role: {auth.role}</h6>   
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