import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import AddEventModal from "./modals/addEventModal"
import DeleteEventModal from "./modals/deleteEventModal"
import axios from "axios";
import { addTokenToHeaders } from "../Service/AuthUser";


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


export default function EventTable(props) {
  const { showSnack, ref } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [events, setEvents] = React.useState([]);
  const [isAddOpen, setAddOpen] = React.useState(false);  //состояние модального окна добавления
  const [isDelOpen, setDelOpen] = React.useState(false);  //окно удаления
  const [selectedEvent, setSelectedEvent] = useState(null); //выбраное событие

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    //закрытие модального окна через пропсы из EventTable
  const closeAddModal = () => {
    setAddOpen(false);
  };

  //отображение GET
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      addTokenToHeaders();
      const response = await axios.get(`http://localhost:5000/events`);
      let fetchedEvents = response.data;
      // console.log(fetchedEvents)
      setEvents(fetchedEvents);
      if (tableRef.current && tableRef.current.refresh) {
        tableRef.current.refresh();
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchEvents,
  }));

  //добавление event
  const handleAddEvent = async (eventData) => {
    try {
      addTokenToHeaders();
      // console.log(eventData);
      // const formData = new FormData();
      // formData.append('name', eventData.name);
      // formData.append('description', eventData.description);
      // formData.append('image', eventData.image);
      // formData.append('startDate', eventData.startDate);
      // formData.append('endDate', eventData.endDate);
      const response = await axios.post(
        "http://localhost:5000/events/", eventData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      setAddOpen(false);
      showSnack(response.data.message);
      setTimeout(() => {
        fetchEvents();
      }, 4000);
      // console.log("Event created:", response.data.message);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data;
        showSnack(errorMessage.message)
        // console.log(errorMessage.message)
        console.error("Error create event:", error);
      } else {
        console.error("Network error:", error);
      }
    }
  };
        
    // Функция для открытия модального окна удаления
    const openDeleteModal = (id) => {
      setSelectedEvent(id); // Сохранение id события, которое будет удалено
      setDelOpen(true);
    };

    //метод удаления delete
    const handleDeleteEvent = async () => {
      try {
        addTokenToHeaders();
        await axios.delete(`http://localhost:5000/events/${selectedEvent}`);
        setDelOpen(false);
        fetchEvents();
      } catch (error) {
        console.error("Error delete event:", error);
      }
    };


  // Добавим функцию для преобразования даты и времени
  const formatDate = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-gb", options);
  };


  

  return (
    <>
      <TableContainer component={Paper}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setAddOpen(true)}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add event
          </Button>
        </Stack>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event) => (
                <TableRow key={event._id}>
                    <TableCell component="th" scope="row">
                    {event.image && (
                      <img
                        src={event.image}
                        alt="Event"
                        width="50"
                        height="50"
                      />
                    )}
                    </TableCell>
                  <TableCell component="th" scope="row">
                    {event.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {event.description}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {formatDate(event.startDate)}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {formatDate(event.endDate)}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => openDeleteModal(event._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={events.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
        <AddEventModal
          open={isAddOpen}
          close={closeAddModal}
          onSubmit={handleAddEvent}
        />
        <DeleteEventModal
          deleteOpen={isDelOpen}
          handleClose={()=>{setDelOpen(false)}}
          onDelete={handleDeleteEvent}
        />
      </TableContainer>
    </>
  );
}
