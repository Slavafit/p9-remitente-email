import * as React from 'react';
import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {Select, FormControl, InputLabel, OutlinedInput, MenuItem, Stack} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import { addTokenToHeaders } from "../service/AuthUser";
import axios from 'axios';


const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: 9,
  left: "20%",
  right: 0,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});



export default function Remitente({showSnack, contacts, events}) {
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [filteredContacts, setFilteredContacts] = React.useState(contacts);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  // console.log(events);
  
  //обработчик выбора события
  const handleChange = (event) => {
    setSelectedEvent(event.target.value);
    const selectedEventName = event.target.value;

      // Находим событие в массиве events по его имени
    const selectedEvent = events.find(event => event.name === selectedEventName);
    if (selectedEvent) {
      setSelectedEventId(selectedEvent._id);
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
    // {
    //   field: 'nombre',
    //   headerName: 'Nombre',
    //   width: 150,
    //   sortable: false,
    //   renderHeader: (params) => (
    //     <select onChange={handleDropdownChange}>
    //       <option value="">Todos</option>
    //       {uniqueNames.map((name, index) => (
    //         <option key={index} value={name}>
    //           {name}
    //         </option>
    //       ))}
    //     </select>
    //   ),
    // },
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

        console.log("maillistPost", mailData);
        addTokenToHeaders();
        const response = await axios.post(`http://localhost:5000/maillists`, mailData);
        let responseData = response.data.message;
        console.log(responseData);
        showSnack(responseData);
      } catch (error) {
        let resError = error.response.data.message;
        showSnack(resError);
        console.error("Error post MailList:", error);
      }
    };


  return (
    <Paper elevation={3} sx={{ height: 'auto', width: '100%', backgroundColor: 'grey.300' }}>
      <FormControl sx={{ m: 1,  minWidth: 250 }}>
        <InputLabel id="event-name">New events</InputLabel>
        <Select
          labelId="event-name"
          value={selectedEvent}
          onChange={handleChange}
          input={<OutlinedInput label="Event" />}
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
        <Stack direction="row" spacing={2}>
          <StyledFab title="send" size="medium" color="secondary">
              <SendIcon onClick={() => maillistPost()}/>
          </StyledFab>
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
