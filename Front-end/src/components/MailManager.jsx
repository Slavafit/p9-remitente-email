import * as React from 'react';
import { useState, useEffect } from 'react'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { addTokenToHeaders } from "../service/addTokenToHeaders";




const MailManager = ({ events, contacts, showSnack, search, setLoading, refreshFlag, updateMailLists }) => {
  const [eventName, setEventName] = React.useState([]);
  const [mailLists, setMailList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);


// console.log("MailManager", events);


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
      const response = await axios.get(`https://p9-remitente.oa.r.appspot.com/maillists`);
      let fetchedData = response.data;
      setMailList(fetchedData);
      setLoading(false);
      updateMailLists(fetchedData);
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

    const getContactStatus = (contact) => {
      const list = mailLists.find((list) =>
        list.entries.some((entry) => entry.contact === contact._id && list.event === selectedEventId)
      );
    
      if (list) {
        const contactEntry = list.entries.find(entry => entry.contact === contact._id);
    
        if (contactEntry) {
          return (
            <div>
              <span style={{ color: contactEntry.isSent ? 'green' : 'red' }}>
                {contactEntry.isSent ? 'Enviada' : 'No enviada'}
              </span>
            </div>
          );
        }
      }
      return null;
    };

    const getContactResponse = (contact) => {
      const list = mailLists.find((list) =>
        list.entries.some((entry) => entry.contact === contact._id && list.event === selectedEventId)
      );
    
      if (list) {
        const contactEntry = list.entries.find(entry => entry.contact === contact._id);
    
        if (contactEntry) {
          let color;
          if (contactEntry.response === 'Voy') {
            color = 'green';
          } else if (contactEntry.response === 'No puedo') {
            color = 'red';
          } else {
            color = 'gray';
          }
    
          return (
            <div>
              <span style={{ color: color }}>
                {contactEntry.response || 'Vacía'}
              </span>
            </div>
          );
        }
      }
      return null;
    };


  return (
    <Paper elevation={3} sx={{ height: 'auto', width: '100%', backgroundColor: 'grey.300' }}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="event-name">Eventos abiertos</InputLabel>
        <Select
          title="eventos abiertos"
          labelId="event-name"
          value={selectedEventId}
          onChange={handleChange}
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
              <TableCell align="right">Estado</TableCell>
              <TableCell align="right">Respuesta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredContacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>{contact ? contact.nombre : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.cargo : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.entidad : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.categoria : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.provincia : '-'}</TableCell>
                  <TableCell align="right">{contact ? contact.territorio : '-'}</TableCell>
                  <TableCell align="right">
                    {getContactStatus(contact)}
                  </TableCell>
                  <TableCell align="right">
                    {getContactResponse(contact)}
                  </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MailManager;