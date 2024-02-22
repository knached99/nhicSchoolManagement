

import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';


const profilePicPath = "http://localhost:8000/storage/profile_pics"; 

const AutoCompleteSearch = ({ auth }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const autoCompleteSearch = async () => {
    try {
      if (searchQuery.length === 0) {
        // Handle empty search query
      } else {
        setLoading(true);
        const response = await axios.get(`/search?query=${searchQuery}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.errors) {
          setSearchResults([]);
        } else {
          setSearchResults(response.data.results);
        }
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resultsFound = () => {
    const results = searchResults && searchResults.length > 0;
    return (
      <div className={`relative`}>
        <div className={`absolute bottom-0 right-0 py-2 px-3 ${results ? 'bg-green-200' : 'bg-red-200'}`}>
          {results ? (
            <span className="text-green-800">
              {searchResults.length} result(s) found.
            </span>
          ) : (
            <span className="text-red-800">
              No results found.
            </span>
          )}
        </div>
      </div>
    );
  };
  


  const handleItemClick = (item) => {
    if (item.faculty_id) {
      viewFacultyDetails(item.faculty_id);
    } else if (item.user_id) {
      viewUserDetails(item.user_id);
    } else if (item.student_id) {
      viewStudentDetails(item.student_id);
    }
  };

  const viewFacultyDetails = (user_id) => {
    if (auth.faculty_id !== user_id) {
      window.location.href = `/faculty/profile/${user_id}/view`;
    } else {
      window.location.href = '/faculty/profile';
    }
  };

  const viewUserDetails = (user_id) => {
    // Implement viewUserDetails logic
  };

  const viewStudentDetails = (student_id) => {
    window.location.href = `/student/${student_id}/view`;
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const stringAvatar = (name) => ({
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  });

  

  return (
    <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
  <AutoComplete
  style={{width: '100%', padding: 0, margin: 10}}
  value={searchQuery}
  suggestions={searchResults}
  completeMethod={autoCompleteSearch}
  onChange={(e) => setSearchQuery(e.target.value)}
  field="search"
  placeholder="Search for people..."
 

  itemTemplate={(item) => (
    <div className="inline-block" onClick={() => handleItemClick(item)}>
    {item.faculty_id && item.name && (
      <div>
        <Avatar alt="Profile Picture" src={`${profilePicPath}/${item.profile_pic}`} />
        <div>
          <span>Faculty | {item.name}</span>
          <span className="block">{item.email}</span>
          <span className="block">{item.role}</span>
        </div>
      </div>
    )}
    {item.user_id && item.name && (
      <div>
        <Avatar sx={{ width: 50, height: 50 }} {...stringAvatar(`${item.name}`)} />
        <div>
          <span>Parent | {item.name}</span>
          <span className="block">{item.email}</span>
        </div>
      </div>
    )}
    {item.student_id && item.first_name && item.last_name && (
      <div>
        <Avatar sx={{ width: 50, height: 50 }} {...stringAvatar(`${item.first_name} ${item.last_name}`)} />
        <div>
          <span>Student | {`${item.first_name} ${item.last_name}`}</span>
          <span className="block">{item.gender}</span>
        </div>
      </div>
    )}
  </div>
  )}
/>

    </form>

  );
};

export default AutoCompleteSearch;
