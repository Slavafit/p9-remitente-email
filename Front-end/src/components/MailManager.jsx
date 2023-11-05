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
import { addTokenToHeaders } from "../service/AuthUser";




const MailManager = ({ events, contacts, showSnack, search, setLoading, refreshFlag }) => {
  const [eventName, setEventName] = React.useState([]);
  const [mailLists, setMailList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);


// console.log("MailManager", mailLists);


  const handleChange = (event) => {
    setSelectedEventId(event.target.value);
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
  const fetchMailLists = async () => {
    try {
      setLoading(true);
      addTokenToHeaders();
      const response = await axios.get(`http://localhost:5000/maillists`);
      let fetchedData = response.data;
      setMailList(fetchedData);
      setLoading(false);
    } catch (error) {
      showSnack(error.data.message);
      console.error("Error fetching MailLists:", error);
    }
  };
  
  useEffect(() => {
    fetchMailLists();
  }, [refreshFlag]);



      // Функция поиска контакта по его ID
  const findContactById = (contactId) => {
    return contacts.find((contact) => contact._id === contactId);
  };

    useEffect(() => {
      const selectedMail = mailLists.find((mail) => mail.event === selectedEventId);
      // console.log("selectedMail",selectedMail);
      // console.log("filteredContacts",filteredContacts);
      if (selectedMail) {
        //ищу все контакты по id из entries
        const contactsFromMail = selectedMail.entries.map((entry) => findContactById(entry.contact));

        setFilteredContacts(contactsFromMail);
      } else {
        setFilteredContacts([]);
      }
    }, [selectedEventId, mailLists]);


  return (
    <Box>
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="event-name">Event</InputLabel>
        <Select
          labelId="event-name"
          value={selectedEventId}
          onChange={handleChange}
          input={<OutlinedInput label="Event" />}
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
      <TableContainer component={Paper}>
        <Stack direction="row" spacing={2} >
        </Stack>
        <Table sx={{ minWidth: '100%', backgroundColor: 'grey.300' }} aria-label="contact pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Cargo</TableCell>
              <TableCell align="right">Entidad</TableCell>
              <TableCell align="right">Categoria</TableCell>
              <TableCell align="right">Provincia</TableCell>
              <TableCell align="right">Territorio</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Response</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {/* {filteredContacts && filteredContacts.length > 0 && filteredContacts.map((contact) => ( */}
          {filteredContacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>{contact ? contact.nombre : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.cargo : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.entidad : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.categoria : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.provincia : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.territorio : '-'}</TableCell>
                  <TableCell align="right">
                    {mailLists
                      .filter((list) =>
                        list.entries.some((entry) => entry.contact === contact._id)
                      )
                      .map((list) =>
                        list.entries
                          .filter((entry) => entry.contact === contact._id)
                          .map((entry, index) => (
                            <div key={index}>
                              <span style={{ color: entry.isSent ? 'green' : 'red' }}>
                                {entry.isSent ? 'Enviada' : 'No enviada'}
                              </span>
                            </div>
                          ))
                      )}
                  </TableCell>
                  <TableCell align="right">
                    {mailLists
                      .filter((list) =>
                        list.entries.some((entry) => entry.contact === contact._id)
                      )
                      .map((list) =>
                        list.entries
                          .filter((entry) => entry.contact === contact._id)
                          .map((entry, index) => (
                            <div key={index}>
                              {entry.response === 'Voy' ? (
                                <span style={{ color: 'green' }}>{entry.response}</span>
                              ) : entry.response === 'No puedo' ? (
                                <span style={{ color: 'red' }}>{entry.response}</span>
                              ) : entry.response ? (
                                <span>{entry.response}</span>
                              ) : (
                                <span style={{ color: 'gray' }}>Vacío</span>
                              )}
                            </div>
                          ))
                      )}
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MailManager;