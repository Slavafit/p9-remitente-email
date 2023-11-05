import * as React from 'react';
import { useState, useEffect } from 'react'
import { Select, MenuItem, TextField, Button, FormControl,
   InputLabel, Box, OutlinedInput,  List,
   ListItem,
   ListItemText,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Checkbox,} from '@mui/material';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { addTokenToHeaders } from "../Service/AuthUser";




const MailManager = ({ events, contacts, showSnack, search }) => {
  const [eventName, setEventName] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [mailLists, setMailList] = useState([]);


// console.log("MailManager", mailLists);


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    if (eventName.length > 0) {
      setEventName([value]);
    } else {
      setEventName(
        typeof value === 'string' ? value.split(',') : value
      );
    }
  };

  const handleKeyDown = (e) => {
    if (isFocused && e.key.length === 1) {
      const index = events.findIndex(
        (event) => event.name.toLowerCase().startsWith(e.key)
      );
      if (index !== -1) {
        setEventName([mailLists[index].name]);
      }
    }
  };
  


  //отображение GET
  useEffect(() => {
    fetchMailLists();
  }, []);


  const fetchMailLists = async () => {
    try {
      addTokenToHeaders();
      const response = await axios.get(`http://localhost:5000/maillists`);
      let fetchedData = response.data;
      console.log("EventItem:", fetchedData)
      setMailList(fetchedData);
    } catch (error) {
      showSnack(error.data.message);
      console.error("Error fetching MailLists:", error);
    }
  };



  const handleSendMessage = async () => {
    // Формирование объекта для отправки
    const messageEntries = filtered.map((contact) => ({
      contact: contact._id,
    }));

    const messageData = {
      event: selectedEvent, // Выбранное событие
      entries: messageEntries, // Сформированный список сообщений
    };

    try {
      addTokenToHeaders();
      console.log("data to server",messageData);
      const response = await axios.post('http://localhost:5000//maillists/', messageData);
      console.log('Message sent:', response.data);
    } catch (error) {
      showSnack(error.data.message);
      console.error('Error saving mail status:', error);
    }
  };



  // Функция поиска события по его ID
  const findEventById = (eventId) => {
    return events.find((event) => event._id === eventId);
  };

      // Функция поиска контакта по его ID
  const findContactById = (contactId) => {
    return contacts.find((contact) => contact._id === contactId);
  };

  // только тех событий, у которых used имеет значение true
  const filteredEvents = events.filter((event) => event.used === true);
  

  return (
    <Box sx={{ p: 2 }}>
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="event-name">Event</InputLabel>
        <Select
          labelId="event-name"
          value={eventName}
          onChange={handleChange}
          input={<OutlinedInput label="Event" />}
          onKeyDown={handleKeyDown}
          autoFocus
          >
          {filteredEvents.map((event) => (
            <MenuItem
              key={event._id}
              value={event.name}
            >
              {event.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSendMessage}>
        Send Message
      </Button>
      <TableContainer component={Paper}>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        </Stack>
        <Table sx={{ minWidth: 500, backgroundColor: 'grey.200' }} aria-label="contact pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Cargo</TableCell>
              <TableCell align="right">Entidad</TableCell>
              <TableCell align="right">Categoria</TableCell>
              <TableCell align="right">Provincia</TableCell>
              <TableCell align="right">Territorio</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Response</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {mailLists.map((mail) => (
             mail.entries.map((entry) => {
              const contact = findContactById(entry.contact);
              return (
                <TableRow key={entry._id}>
                  <TableCell>{contact ? contact.nombre : '-'}</TableCell>
                  <TableCell>{contact ? contact.cargo : '-'}</TableCell>
                  <TableCell>{contact ? contact.entidad : '-'}</TableCell>
                  <TableCell>{contact ? contact.categoria : '-'}</TableCell>
                  <TableCell>{contact ? contact.provincia : '-'}</TableCell>
                  <TableCell>{contact ? contact.territorio : '-'}</TableCell>
                  <TableCell>
                      {entry.status}
                    </TableCell>
                  <TableCell>
                    {entry.response}
                    </TableCell>
                </TableRow>
                );
              })
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MailManager;