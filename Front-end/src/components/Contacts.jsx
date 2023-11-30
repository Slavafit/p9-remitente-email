import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import AddContactModal from "./modals/addContactModal"
import EditContactModal from "./modals/editContactModal"
import DelContactModal from "./modals/delContactModal"
import axios from "axios";
import { addTokenToHeaders } from "../service/addTokenToHeaders";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

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



const ContactTable = (({lists, showSnack, search, updateContacts, setLoading, refreshFlag }) => {
  
  const [contacts, setContacts] = React.useState([]);
  const [isAddOpen, setAddOpen] = React.useState(false);  //состояние модального окна добавления
  const [isEditOpen, setEditOpen] = React.useState(false);  //состояние модального окна изменения
  const [isDelOpen, setDelOpen] = React.useState(false);  //окно удаления
  const [selContact, setSelContact] = useState(null); //выбраный контакт
  const [filtered, setFiltered] = useState([]);

  // console.log("ContactTable",contacts);

    //закрытие модального окна
  const closeAddModal = () => {
    setAddOpen(false);
  };


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


    //отображение GET
  const fetchContacts = async () => {
    try {
      setLoading(true);
      addTokenToHeaders();
      // const response = await axios.get(`https://p9-remitente.oa.r.appspot.com/contacts`);
      const response = await axios.get(`http://localhost:5000/contacts`);
      let fetchedContacts = response.data;
      // console.log("Contact:", fetchedContacts)
      setContacts(fetchedContacts);
      updateContacts(fetchedContacts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

    useEffect(() => {
      fetchContacts();
    }, [refreshFlag]);


  //добавление contact
  const handleAddContact = async (contactData) => {
    // console.log(contactData);
    try {
      setLoading(true);
      addTokenToHeaders();
      const response = await axios.post(
        "https://p9-remitente.oa.r.appspot.com/contacts/", contactData);
      setAddOpen(false);
      showSnack('success', response.data.message);
      setTimeout(() => {
        fetchContacts();
      }, 2000);
      // console.log("contact created:", response.data.message);
      setLoading(false);
    } catch (error) {
      if ( error.response.data && error.response.data.message) {
        const resError = error.response.data.message;
        // showSnack(resError);
        showSnack('warning', resError);
    } else if ( error.response.data.errors && error.response.data.errors.length > 0) {
        const resError = error.response.data.errors[0].message;
        console.log(resError);
        showSnack('warning', resError);
    } else {
        console.error(`Error create contact ${listName}:`, error);
        showSnack('warning', 'Error post contact');
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

    const handleEditEvent = async (contactData) => {
      try {
        setLoading(true);
        // console.log(contactData)
        const response = await axios.put(
          `https://p9-remitente.oa.r.appspot.com/contacts/${selContact._id}`, contactData);
          let message = response.data.nombre
        if (response.status === 200) {
          closeEditModal();
          showSnack(`Contact ${message} was updated`);
          setTimeout(() => {
            fetchContacts();
          }, 2000);
        }
        setLoading(false);
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
        setLoading(true);
        // console.log("handleDeleteContact",selContact);
        addTokenToHeaders();
        const response = await axios.delete(`https://p9-remitente.oa.r.appspot.com/contacts/${selContact}`);
        showSnack(response.data.message);
        setDelOpen(false);
        fetchContacts();
        setLoading(false);
      } catch (error) {
        console.error("Error delete contact:", error);
      }
    };


    const columns = [
      { field: "nombre", headerName: "Nombre", width: 180 },
      { field: "cargo", headerName: "Cargo", width: 100 },
      { field: "entidad", headerName: "Entidad", width: 100 },
      { field: "categoria", headerName: "Categoria", width: 100,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{params.value}</div>
      )},
      { field: "povincia", headerName: "Provincia", width: 100 },
      { field: "territorio", headerName: "Territorio", width: 120,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{params.value}</div>
      )},
      { field: "email", headerName: "Email", width: 200 },
      { field: "telefono", headerName: "Telefono", width: 130 },
      {
        field: "actions",
        headerName: "Actions",
        width: 80,
        renderCell: (params) => (
          <>
            <EditIcon
              style={{ cursor: "pointer", marginRight: 8 }}
              onClick={() => openEditEvent(params.row)}
            />
            <DeleteIcon
              style={{ cursor: "pointer" }}
              onClick={() => openDeleteModal(params.row)}
            />
          </>
        ),
      },
    ];
    

   return (
    <>  
      <TableContainer component={Paper}>
        <Stack direction="row" spacing={2}>
          <StyledFab title="add contact" size="small" color="secondary">
            <AddIcon onClick={() => setAddOpen(true)}/>
          </StyledFab>
        </Stack>
      </TableContainer>
      <DataGrid
            sx={{ 
              backgroundColor: 'grey.300',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
            }}
            rows={filtered}
            getRowId={(contacts) => contacts._id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            slots={{ toolbar: GridToolbar }}
            
          />
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
          lists={lists}
          initNombre={selContact ? selContact.nombre : ""}
          initCargo={selContact ? selContact.cargo : ""}
          initEntidad={selContact ? selContact.entidad : ""}
          initCategoria={selContact ? selContact.categoria : ""}
          initProvincia={selContact ? selContact.provincia : ""}
          initTerritorio={selContact ? selContact.territorio : ""}
          initEmail={selContact ? selContact.email : ""}
          initTelefono={selContact ? selContact.telefono : ""}
        />
        <DelContactModal
          deleteOpen={isDelOpen}
          handleClose={()=>{setDelOpen(false)}}
          onDelete={handleDeleteContact}
        />
    </>
  );
});

export default ContactTable;