import React, { useState, useEffect } from "react";
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
import AddContactModal from "./modals/addContactModal"
import EditContactModal from "./modals/editContactModal"
import DelContactModal from "./modals/delContactModal"
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


const ContactTable = (({lists, showSnack, search }) => {
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [contacts, setContacts] = React.useState([]);
  const [isAddOpen, setAddOpen] = React.useState(false);  //состояние модального окна добавления
  const [isEditOpen, setEditOpen] = React.useState(false);  //состояние модального окна изменения
  const [isDelOpen, setDelOpen] = React.useState(false);  //окно удаления
  const [selContact, setSelContact] = useState(null); //выбраный контакт
  const [filtered, setFiltered] = useState([]);

  // console.log("ContactTable",contacts);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contacts.length) : 0;

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
    fetchContacts();
  }, []);

  //функция поиска
  useEffect(() => {
    if (contacts.length > 0) {
      const filteredData = contacts.filter(event =>
        event.nombre.toLowerCase().includes(search.toLowerCase())
        // Другие условия фильтрации поиска здесь, если необходимо
      );
      setFiltered(filteredData);
    }
  }, [contacts, search]);


  const fetchContacts = async () => {
    try {
      addTokenToHeaders();
      const response = await axios.get(`http://localhost:5000/contacts`);
      let fetchedContacts = response.data;
      // console.log("Contact:", fetchedContacts)
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };


  //добавление event
  const handleAddContact = async (contactData) => {
    // console.log(contactData);
    try {
      addTokenToHeaders();
      const response = await axios.post(
        "http://localhost:5000/contacts/", contactData);
      setAddOpen(false);
      // console.log(response.data);
      showSnack(response.data.message);
      setTimeout(() => {
        fetchContacts();
      }, 2000);
      // console.log("contact created:", response.data.message);
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
      setSelContact(event);
      setEditOpen(true);
    };
    //закрыть окно редактирования
    const closeEditModal = () => {
      setSelContact(null);
      setEditOpen(false);
    };

    const handleEditEvent = async (eventData) => {
      try {
        addTokenToHeaders();
        await axios.put(`http://localhost:5000/contacts/?_id=${selContact._id}`, eventData);
        setTimeout(() => {
          fetchContacts();
        }, 3000);
        closeEditModal();
      } catch (error) {
        console.error("Error updating contact:", error);
      }
    };
        

    // Функция для открытия модального окна удаления
    const openDeleteModal = (event) => {
      setSelContact(event._id); // Сохранение id события, которое будет удалено
      setDelOpen(true);
    };

    //метод удаления delete
    const handleDeleteContact = async () => {
      try {
        console.log("handleDeleteContact",selContact);
        addTokenToHeaders();
        const response = await axios.delete(`http://localhost:5000/contacts/${selContact}`);
        showSnack(response.data.message);
        setDelOpen(false);
        fetchContacts();
      } catch (error) {
        console.error("Error delete contact:", error);
      }
    };



  

  return (
    <>
      <TableContainer component={Paper} sx={{ backgroundColor: 'grey.300' }}>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            
            onClick={() => setAddOpen(true)}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add contact
          </Button>
        </Stack>
        <Table sx={{ minWidth: 500 }} aria-label="contact pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell align="right">Entidad</TableCell>
              <TableCell align="right">Categoria</TableCell>
              <TableCell align="right">Provincia</TableCell>
              <TableCell align="right">Territorio</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Telefono</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell component="th" scope="row">
                    {contact.nombre}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {contact.cargo}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {contact.entidad}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {contact.categoria}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {contact.provincia}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {contact.territorio}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {contact.email}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {contact.telefono}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => openEditEvent(contact)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => openDeleteModal(contact)}>
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
                count={contacts.length}
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
        <AddContactModal
          open={isAddOpen}
          close={closeAddModal}
          onSubmit={handleAddContact}
          lists={lists}
        />
        <EditContactModal
          editOpen={isEditOpen}
          editClose={closeEditModal}
          onSubmit={handleEditEvent}
          initName={selContact ? selContact.name : ""}
          initDescrip={selContact ? selContact.description : ""}
          initImage={selContact ? selContact.image : ""}
          initStartDate={selContact ? selContact.startDate : ""}
          initEndDate={selContact ? selContact.endDate : ""}
        />
        <DelContactModal
          deleteOpen={isDelOpen}
          handleClose={()=>{setDelOpen(false)}}
          onDelete={handleDeleteContact}
        />
      </TableContainer>
    </>
  );
});

export default ContactTable;