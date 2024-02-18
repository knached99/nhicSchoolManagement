import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function SearchBar() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      autoCompleteSearch();
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
      <div>
        <div>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          id="search"
          name="search"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </form>
  );
}
