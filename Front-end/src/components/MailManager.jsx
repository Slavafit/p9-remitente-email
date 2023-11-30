import * as React from 'react';
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { styled, useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { addTokenToHeaders } from "../service/addTokenToHeaders";

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


const MailManager = ({ events, contacts, showSnack, search, setLoading, refreshFlag, updateMailLists }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [eventName, setEventName] = React.useState([]);
  const [mailLists, setMailList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredContacts.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
          if (contactEntry.response === 'Asistencia') {
            color = 'green';
          } else if (contactEntry.response === 'NO asistencia') {
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
          // onKeyDown={handleKeyDown}
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
          {(rowsPerPage > 0
          ? filteredContacts
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : filteredContacts)
          .map((contact, index) => (
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
                count={filteredContacts.length}
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
      </TableContainer>
    </Paper>
  );
};

export default MailManager;