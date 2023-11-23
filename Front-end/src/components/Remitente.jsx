import * as React from 'react';
import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {Select, FormControl, InputLabel, OutlinedInput, MenuItem, Stack} from '@mui/material';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Fab from '@mui/material/Fab';
import { addTokenToHeaders } from "../service/addTokenToHeaders";
import axios from 'axios';


const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: 9,
  left: "60%",
  right: 0,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});
const StyleFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: 9,
  left: "75%",
  right: 0,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});



export default function Remitente({showSnack, contacts, events, mailLists}) {
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [filteredContacts, setFilteredContacts] = React.useState(contacts);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [existeEvent, setExisteEvent] = useState('');
  const [selmailLists, setMailLists] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');


  
  //обработчик выбора нового события
  const handleChange = (event) => {
    setSelectedEvent(event.target.value);
    const selectedEventName = event.target.value;
    // console.log(event);

      // Находим событие в массиве events по его имени
    const selectedEvent = events.find(event => event.name === selectedEventName);
    if (selectedEvent) {
      setSelectedEventId(selectedEvent._id);
    }
  };



    //обработчик выбора открытого события
    const handleEventUsedChange = (event) => {
      setMailLists(event.target.value);
      const selectedEventId = event.target.value;
      // console.log(selectedEventId);

            // Находим событие в массиве events по его имени
    const findExisteEvent = events.find(event => event._id === selectedEventId);
    if (findExisteEvent) {
      setExisteEvent(findExisteEvent.name);
      // console.log(existeEvent);
    }
    };

  // Фильтрация событий, где used равно false
  const filteredEvents = events.filter(event => !event.used); 


  const handleKeyDown = (e) => {
    if (isFocused && e.key.length === 1) {
      const index = events.findIndex(
        (event) => event.name.toLowerCase().startsWith(e.key)
      );
      if (index !== -1) {
        setEventName([events[index].name]);
      }
    }
  };



  //обработчик выбора nombre
  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue !== '') {
      const newFilteredContacts = contacts.filter((contact) => contact.nombre === selectedValue);
      setFilteredContacts(newFilteredContacts);
    } else {
      setFilteredContacts(contacts);
    }
  };
  
  const uniqueNames = [...new Set(contacts.map((contact) => contact.nombre))];
  
  const columns = [

    { field: 'nombre', headerName: 'Nombre', width: 170 },
    { field: 'cargo', headerName: 'Cargo', width: 150 },
    { field: 'categoria', headerName: 'Categoria', width: 150 },
    { field: 'provincia', headerName: 'Provincia', width: 130 },
    { field: 'territorio', headerName: 'Territorio', width: 130 },
    {
      field: 'email',
      headerName: 'Email',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 180,
      valueGetter: (params) =>
        `${params.row.email || ''}`,
    },
    {
      field: 'telefono',
      headerName: 'Telefono',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      filterable: false,
      width: 130,
      valueGetter: (params) =>
        `${params.row.telefono || ''}`,
    },
  ];
  //обработчик id выделенного контакта
  const handleSelectedConact = (selContactId) => {
    setSelectedIds(selContactId);
  };


    //метод Post
    const maillistPost = async () => {
      try {
        const mailData = {
          eventId: selectedEventId,
          eventName: selectedEvent,
          contacts: selectedIds
        };

        addTokenToHeaders();
        const response = await axios.post(`https://p9-remitente.oa.r.appspot.com/maillists`, mailData);
        let responseData = response.data.message;
        // console.log(responseData);
        showSnack('success', responseData);
      } catch (error) {
        if ( error.response.data && error.response.data.message) {
          const resError = error.response.data.message;
          // showSnack(resError);
          showSnack('warning', resError);
      } else if ( error.response.data.errors && error.response.data.errors.length > 0) {
          const resError = error.response.data.errors[0].message;
          showSnack('warning', resError);
      } else {
          console.error("Error post MailList:", error);
          showSnack('Error post MailList');
        }
      }
    };


    //метод Patch
    const maillistPatch = async () => {
      try {
        const mailData = {
          eventId: selmailLists,
          eventName: existeEvent,
          contacts: selectedIds
        };
        console.log(mailData);
        addTokenToHeaders();
        const response = await axios.patch(`https://p9-remitente.oa.r.appspot.com/maillists`, mailData);
        let responseData = response.data.message;
        showSnack(responseData);
      } catch (error) {
        if ( error.response.data && error.response.data.message) {
          const resError = error.response.data.message;
          showSnack('warning', resError);
      } else if ( error.response.data.errors && error.response.data.errors.length > 0) {
          const resError = error.response.data.errors[0].message;
          showSnack('warning', resError);
      } else {
          console.error("Error patch MailList:", error);
          showSnack('warning','Error patch MailList');
        }
      }
    };


  return (
    <Paper elevation={3} sx={{ 
      height: 'auto', 
      width: '100%', 
      backgroundColor: 'grey.300', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
      }}>
      <FormControl sx={{ m: 1,  minWidth: 300 }}>
        <InputLabel id="event-name">Eventos nuevos</InputLabel>
        <Select
        title="Eventos nuevos"
          labelId="event-name"
          value={selectedEvent}
          onChange={handleChange}
          input={<OutlinedInput label="Eventos nuevos" />}
          autoFocus
          onKeyDown={handleKeyDown}
          >
            {filteredEvents.map((event) => (
              <MenuItem key={event._id} value={event.name}>
                {event.name}
              </MenuItem>
            ))}
        </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="event-name">Eventos abiertos</InputLabel>
        <Select
          title="eventos abiertos"
          labelId="event-name"
          value={selmailLists}
          onChange={handleEventUsedChange}
          input={<OutlinedInput label="Eventos abiertos" />}
          onKeyDown={handleKeyDown}
          autoFocus
          >
            {mailLists && mailLists.length > 0 && mailLists.map((event) => {
              const foundEvent = events.find((e) => e._id === event.event);
              return (
                <MenuItem key={event._id} value={event.event}>
                  {foundEvent ? foundEvent.name : ''}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
        <Stack direction="row" spacing={2}>
          <StyledFab title="Mandar contactos" size="small" color="secondary">
              <ForwardToInboxIcon onClick={() => maillistPost()}/>
          </StyledFab>
        </Stack>
        <Stack direction="row" spacing={2}>
          <StyleFab title="añadir contactos" size="small" color="secondary">
              <EventRepeatIcon onClick={() => maillistPatch()}/>
          </StyleFab>
        </Stack>
      <DataGrid
        // rows={filteredContacts}
        rows={contacts}
        columns={columns}
        getRowId={(contacts) => contacts._id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        selectionModel={selectedIds}
        onRowSelectionModelChange={handleSelectedConact}
        autoHeight={true}
      />
    </Paper>
  );
}
