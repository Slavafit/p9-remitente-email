import React, { useState, useEffect } from "react";
import { styled, useTheme} from '@mui/material/styles';
import PropTypes from 'prop-types';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import AddEventModal from "./modals/addEventModal"
import EditEnventModal from "./modals/editEventModal"
import DeleteEventModal from "./modals/deleteEventModal"
import axiosInstance from '../service/interceptor';
import ImageModal from "./modals/imageModal";

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: 9,
  left: "70%",
  right: 0,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});


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


const EventTable = (({ showSnack, search, updateEvents, setLoading, refreshFlag }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [events, setEvents] = React.useState([]);
  const [isAddOpen, setAddOpen] = React.useState(false);  //состояние модального окна добавления
  const [isEditOpen, setEditOpen] = React.useState(false);  //состояние модального окна изменения
  const [isDelOpen, setDelOpen] = React.useState(false);  //окно удаления
  const [selectedEvent, setSelectedEvent] = useState(null); //выбраное событие
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filtered.length) : 0;

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
  //модальное окно открытия увеличения фото
  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


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

    //отображение GET
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/events`);
      let fetchedEvents = response.data;
      // console.log("EventItem:", fetchedEvents)
      setEvents(fetchedEvents);
      updateEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshFlag]);


  //добавление event
  const handleAddEvent = async (eventData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/events/", eventData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      setAddOpen(false);
      showSnack('success', response.data.message);
      fetchEvents();
      // console.log("Event created:", response.data.message);
      setLoading(false);
    } catch (error) {
      if ( error.response.data && error.response.data.message) {
        const resError = error.response.data.message;
        console.error("Error create event:", error);
        showSnack('Atención:', resError);
    } else if ( error.response.data.errors && error.response.data.errors.length > 0) {
        const resError = error.response.data.errors[0].message;
        showSnack('Atención:', resError);
    } else {
        console.error("Network error:", error);
        showSnack('Atención:', 'Network error');
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
        console.log(eventData);
        setLoading(true);
        const response = await axiosInstance.put(`/events/${selectedEvent._id}`, 
          eventData);
          let message = response.data.name;
        showSnack(`Evento "${message}" editado correctamente`)
          console.log(response.data);
          fetchEvents();
        closeEditModal();
        setLoading(false);
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
        setLoading(true);
        const response = await axiosInstance.delete(`/events/${selectedEvent}`);
        // let message = response.data.name;
        console.log(response.data);
        setDelOpen(false);
        fetchEvents();
        setLoading(false);
        showSnack('Atención:', `El evento se ha eliminado correctamente`);
      } catch (error) {
        console.error("Error delete event:", error);
      }
    };





  // Добавим функцию для преобразования даты и времени
  const formatDate = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("DE", options);
  };


  

  return (
    <>
      <TableContainer component={Paper} sx={{boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'}}>
        <Stack direction="row" spacing={2}>
          <StyledFab title="add event" size="small" color="secondary">
            <AddIcon onClick={() => setAddOpen(true)}/>
          </StyledFab>
        </Stack>
        <Table sx={{ 
            minWidth: 500,
            backgroundColor: 'grey.300'
            }} 
            aria-label="event pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Event description</TableCell>
              <TableCell align="right">Start Date&Time</TableCell>
              <TableCell align="right">Adress</TableCell>
              <TableCell align="right">Status</TableCell>
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
                        alt="Event image"
                        width="70"
                        height="50"
                        onClick={() => handleImageClick(event.image)}
                        style={{ cursor: 'pointer' }}
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
                  <TableCell style={{ width: 160 }} align="right">
                    <span style={{ color: event.used ? 'red' : 'green' }}>
                      {event.used ? 'Abierto' : 'Nuevo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => openEditEvent(event)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => openDeleteModal(event)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={filtered.length}
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
          initAddress={selectedEvent ? selectedEvent.adress : ""}
        />
        <DeleteEventModal
          deleteOpen={isDelOpen}
          handleClose={()=>{setDelOpen(false)}}
          onDelete={handleDeleteEvent}
        />
        <ImageModal
          modalOpen={modalOpen}
          imageUrl={modalImage}
          handleClose={handleCloseModal}
        />
      </TableContainer>
    </>
  );
});

export default EventTable;