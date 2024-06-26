import React, {useState, useEffect, forwardRef} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

export default function AttendanceHistory({studentID}) {
    const [rows, setRows] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

const columns = [
  
    {
        width: 120, 
        label: 'Date',
        dataKey: 'created_at',
    },

    {
        width: 120, 
        label: 'Attendance Status',
        dataKey: 'is_present',
    },
];

const fetchAttendanceHistory = async (studentID) => {
    try {
      const response = await fetch(`/getAttendanceHistoryBystudentID/${studentID}`);
      const { attendanceHistory } = await response.json();
      return attendanceHistory;
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const attendanceData = await fetchAttendanceHistory(studentID);
      setRows(attendanceData);
    };

    fetchData();
}, [studentID]);


useEffect(() => {
  // Check if the system is in dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  setIsDarkMode(prefersDarkMode);
}, []);

const backgroundColor = isDarkMode ? '#334155' : 'background.paper';



  

const VirtuosoTableComponents = {
    Scroller: forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  };

  function fixedHeaderContent() {
    return (
      <TableRow> 
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric || false ? 'right' : 'left'}
            style={{ width: column.width, backgroundColor: backgroundColor, color: isDarkMode ? '#fff' : 'inherit', fontWeight: 'bold'}}
            sx={{
              backgroundColor: 'background.paper',
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function rowContent(_index, row) {
    return (
        <>
        <TableCell style={{color: isDarkMode ? '#fff' : 'inherit'}} key="created_at" align="left">
        {new Date(row.created_at).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })}
        </TableCell>
        <TableCell key="is_present" align="left">
          {row.is_present === 1 ? <span class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-md font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">Present</span> : <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-md font-medium text-red-700 ring-1 ring-inset ring-red-700/10">Absent</span>}
        </TableCell>
      </>
    );
  }

  return (
    
    <Paper style={{ height: 400, width: '100%', backgroundColor }}>
     <h1 className="text-center text-lg font-semibold dark:text-white">Attendance History</h1>
     {rows && rows.length > 0 ? (
      <TableVirtuoso
      style={{backgroundColor}}
      data={rows}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />
     )
    : 
    <p className="text-slate-700 text-lg text-center m-10 dark:text-red-50">No Attendance History</p>
    }
    
  </Paper>
  )
}
