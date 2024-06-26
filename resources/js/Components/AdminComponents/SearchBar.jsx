import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Tooltip from '@mui/material/Tooltip';

import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
const profilePicPath = "http://localhost:8000/storage/profile_pics"; 
import CircularProgress from '@mui/material/CircularProgress';

export default function SearchBar({auth}) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const autoCompleteSearch = async () => {
    try {
      if(searchQuery.length === 0){

      }
      else{
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
        setSearchResults(response.data.results);
        setError(null);
        console.log(response.data.results);
      }
    }
    } catch (error) {
      console.log(error.message);
      setError(error.message || 'Unable to complete search, something went wrong');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
    
  };
  
  const clearResults = () => {
    setSearchResults([]);
    setError(null);
  };
  
 

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      autoCompleteSearch();
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const viewFacultyDetails = (user_id) => {
    if(auth.faculty_id !==user_id){
    window.location.href = `/faculty/profile/${user_id}/view`;
    }
    else{
      window.location.href='/faculty/profile';
    }
  }

  const viewStudentDetails = (student_id) => {
    window.location.href = `/student/${student_id}/view`;
  }

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
    <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
       
      <div>
        <div className="inline-block">
      {searchResults.length > 0 && 
          <Tooltip title="clear search results" arrow>
         <IconButton onClick={clearResults}>
         <ClearOutlinedIcon style={{ color: '#eee' }} />
       </IconButton>
          </Tooltip>
         }

         </div>
         {loading ?  <CircularProgress style={{color: '#fff'}}/> 
          :
        <InputBase
          placeholder="Search…"
          id="search"
          name="search"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputProps={{ 'aria-label': 'search' }}
          style={{backgroundColor: '#818cf8', width: '100%', color: '#fff', outline: 'none', padding: 5, margin: 10}}
        /> 
      }
       
    
      </div>
      {error && <span className="text-red-500">{error}</span>}
  
       
     

      {searchResults.length > 0 &&
      <List   sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 200,
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
      >
  {Object.values(searchResults).map((result, index) => (
    <ListItemButton>
    <ListItem key={index} onClick={() => {
      if (result.faculty_id) {
        viewFacultyDetails(result.faculty_id);
      } else if (result.user_id) {
        viewUserDetails(result.user_id);
      } else if (result.student_id) {
        viewStudentDetails(result.student_id);
      }
    }}>
   <ListItemAvatar>
  {result.faculty_id && result.profile_pic !== null ? (
    // Displaying Faculty avatar
    <Avatar alt="Faculty Profile Pic" src={`${profilePicPath}/${result.profile_pic}`} />
  ) : result.student_id && result.profile_pic !== null ? (
    // Displaying Student avatar
  <Avatar sx={{ width: 50, height: 50 }} {...stringAvatar(`${result.first_name} ${result.last_name}`)} />
  ) : (
    // Default avatar for other cases
    <Avatar sx={{ width: 50, height: 50 }} {...stringAvatar(result.name)} />
  )}
</ListItemAvatar>

      {result.user_id && (
        <ListItemText primary={
          <>
          <Typography style={{display: 'inline', fontWeight: 'bold'}}
          component="span"
          variant="body2"
          color="text.primary">
            <span>Parent | {result.name}</span>
          </Typography>
          </>

        } secondary={
          <>
          <Typography sx={{display: 'inline'}}
          component="span"
          variant="body2"
          color="text.primary">
            <span>{result.email}</span>
          </Typography>
          </>
        } />
      )}
      {result.faculty_id && (
        <ListItemText primary={
          <>
          <Typography style={{display: 'inline', fontWeight: 'bold'}}
          component="span"
          variant="body2"
          color="text.primary">
            <span>Faculty | {result.name}</span>
          </Typography>
          </>

        } secondary={
          <>
          <Typography sx={{display: 'inline'}}
          component="span"
          variant="body2"
          color="text.primary">
            <span className="block">{result.email}</span>
            <span className="block">{result.role}</span>
          </Typography>
          </>
        } />
      )}
      {result.student_id && (
        <ListItemText
        primary={
          <>
          <Typography style={{display: 'inline', fontWeight: 'bold'}}
          component="span"
          variant="body2"
          color="text.primary">
            <span>Student | {`${result.first_name} ${result.last_name}`}</span>
          </Typography>
          </>
        }
        secondary={
          <>
          <Typography sx={{display: 'inline'}}
          component="span"
          variant="body2"
          color="text.primary">
            <span>{result.gender}</span>
          </Typography>
          </>
        } />
   
      )}
    </ListItem>

    </ListItemButton>
  ))}
  
</List>
}

    </form>
  );
}
