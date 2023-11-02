import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
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
import EditEnventModal from "./modals/editEventModal"
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


const EventTable = (({ showSnack, search, updateEvents }) => {
  // console.log(search);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [events, setEvents] = React.useState([]);
  const [isAddOpen, setAddOpen] = React.useState(false);  //состояние модального окна добавления
  const [isEditOpen, setEditOpen] = React.useState(false);  //состояние модального окна изменения
  const [isDelOpen, setDelOpen] = React.useState(false);  //окно удаления
  const [selectedEvent, setSelectedEvent] = useState(null); //выбраное событие
  const [filtered, setFiltered] = useState([]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - events.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    //закрытие модального окна
  const closeAddModal = () => {
    setAddOpen(false);
  };

  //отображение GET
  useEffect(() => {
    fetchEvents();
  }, []);

  //функция поиска
  useEffect(() => {
    if (events.length > 0) {
      const filteredData = events.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase())
        // Другие условия фильтрации поиска здесь, если необходимо
      );
      setFiltered(filteredData);
    }
  }, [events, search]);


  const fetchEvents = async () => {
    try {
      addTokenToHeaders();
      const response = await axios.get(`http://localhost:5000/events`);
      let fetchedEvents = response.data;
      // console.log("EventItem:", fetchedEvents)
      setEvents(fetchedEvents);
      updateEvents(fetchedEvents)
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

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
      }, 3000);
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



    //показать окно редактирования
    const openEditEvent = (event) => {
      setSelectedEvent(event);
      setEditOpen(true);
    };
    //закрыть окно редактирования
    const closeEditModal = () => {
      setSelectedEvent(null);
      setEditOpen(false);
    };

    const handleEditEvent = async (eventData) => {
      try {
        addTokenToHeaders();
        await axios.put(`http://localhost:5000/events/?_id=${selectedEvent._id}`, eventData);
        setTimeout(() => {
          fetchEvents();
        }, 3000);
        closeEditModal();
      } catch (error) {
        console.error("Error updating event:", error);
      }
    };
        

    // Функция для открытия модального окна удаления
    const openDeleteModal = (event) => {
      setSelectedEvent(event._id); // Сохранение id события, которое будет удалено
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
    return dateTime.toLocaleString("en-GB", options);
  };


  

  return (
    <>
      <TableContainer component={Paper}>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Fab size="small" color="secondary" aria-label="add">
            <AddIcon onClick={() => setAddOpen(true)}/>
          </Fab>
          {/* <Button
            variant="outlined"
            fullWidth
            
            onClick={() => setAddOpen(true)}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add event
          </Button> */}
        </Stack>
        <Table sx={{ minWidth: 500 }} aria-label="event pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Event description</TableCell>
              <TableCell align="right">Start Date&Time</TableCell>
              <TableCell align="right">Adress</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
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
                    {event.adress}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => openEditEvent(event)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => openDeleteModal(event)}>
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
        <EditEnventModal
          editOpen={isEditOpen}
          editClose={closeEditModal}
          onSubmit={handleEditEvent}
          initName={selectedEvent ? selectedEvent.name : ""}
          initDescrip={selectedEvent ? selectedEvent.description : ""}
          initImage={selectedEvent ? selectedEvent.image : ""}
          initStartDate={selectedEvent ? selectedEvent.startDate : ""}
          initAdress={selectedEvent ? selectedEvent.adress : ""}
        />
        <DeleteEventModal
          deleteOpen={isDelOpen}
          handleClose={()=>{setDelOpen(false)}}
          onDelete={handleDeleteEvent}
        />
      </TableContainer>
    </>
  );
});

export default EventTable;