import React, {useState, useEffect} from 'react';
import {Link, Head } from '@inertiajs/react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
// Icons 
import Face3OutlinedIcon from '@mui/icons-material/Face3Outlined';
import Face6OutlinedIcon from '@mui/icons-material/Face6Outlined';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export default function StudentsList() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);

  useEffect(() => {
    const getStudents = async () => {
        try {
            const response = await axios.get('/getStudents');
            const { students, error } = response.data; // Assuming the response contains an object with 'students' and 'error' properties

            if (error) {
                setError(error);
            } else if (students) {
                console.log(students); // Log the received students
                setRows(students);
            } else {
                setError('Unexpected response format from the server');
            }
            setLoading(false);
        } catch (error) {
            setError(`Error fetching students: ${error.message}`);
            setLoading(false);
        }
    };

    getStudents();
}, []); 


const handleCloseSuccess = () => {
  setSuccessOpen(false);
  setSuccess(null);
};

const handleCloseError = () => {
  setErrorOpen(false);
  setError(null);
};

const viewStudentDetails = (student_id) => {
  window.location.href = `/studentDetails/${student_id}/view`;
}
    
  return (
    <>
    <CssBaseline />
    <Container maxWidth="lg">
        
    <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
    {loading && (
    <Box sx={{ width: '100%' }}>
        <LinearProgress />
    </Box>
)}
{rows.length === 0 ? (
    <h6 className="text-indigo-500 font-semibold">No Information To Display</h6>
) : (
    rows.map((row) => (
        <ListItem key={row.student_id} alignItems="flex-start">
            <ListItemAvatar>
                {row.gender === 'Male' ? <Face6OutlinedIcon /> : <Face3OutlinedIcon />}
            </ListItemAvatar>
            <ListItemText
                primary={`${row.first_name} ${row.last_name}`}
                secondary={
                    <>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            <span className="block">{row.date_of_birth}</span>
                            <span className="block">{`${row.address} ${row.street_address_2 ? row.street_address_2 : ''}, ${row.city} ${row.state}, ${row.zip}`}</span>
                            <div className="float-end">
                                <Button onClick={() => viewStudentDetails(row.student_id)}>
                                    More Details
                                </Button>
                            </div>
                        </Typography>
                    </>
                }
            />
        </ListItem>
    ))
)}


   
    </List>
    </Container>
    </>
  );
}
