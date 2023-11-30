import React, { useState } from 'react'
import { Container } from "@mui/material"
import Header from "./components/Header"
import Search from './components/Search'
import EventTable from './components/EventItem';
import CssBaseline from '@mui/material/CssBaseline';
import Snack from './components/Snack';
import MailManager from './components/MailManager';
import ProfilePage from './Personal';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContactTable from './components/Contacts'
import ListManager from './components/ListManager'
import Remitente from './components/Remitente'
import ShowBackdrop from './service/Loading'
import SignUp from './service/AddUser';
import UsersTable from './UsersTable'




function Home() {
  const [isMenuOpen, setMenuOpen] = useState()
  const [search, setSearch] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('');
  const [snackTitle, setSnackTitle] = useState('');
  const [displayItem, setDisplayItem] = useState('');
  const [displayMail, setDisplayMail] = useState(''); 
  const [showPersonal, setShowPersonal] = React.useState(null); 
  const [showSignUp, setShowSignUp] = React.useState(null); 
  const [showUsersTable, setUsersTable] = React.useState(null); 
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [expanded, setExpanded] = useState('panel1');
  const [lists, setLists] = useState({});
  const [loading, setLoading] = React.useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [mailLists, setMailLists] = useState(false);

  const handleShowSnack = (title, message) => {
    setSnackMessage(message);
    setSnackTitle(title);
    // console.log("title:",snackTitle, "snackMessage",snackMessage);
    setSnackOpen(true);
  };

  const updateEvents = (updatedEvents) => {
    // console.log("Home", updatedEvents)
    setEvents(updatedEvents);
  };
  const updateLists = (updatedLists) => {
    // console.log("Home", updatedLists)
    setLists(updatedLists);
  };
  const updateContacts = (updatedContacts) => {
    // console.log("Home", contacts)
    setContacts(updatedContacts);
  };
  const updateMailLists = (mailLists) => {
    // console.log("Home", mailLists)
    setMailLists(mailLists);
  };
  const openPeronal = () => {
    setDisplayItem(null);
    setDisplayMail(null);
    setShowPersonal(true);
  };
  const openSignUp = () => {
    setShowSignUp(true);
  };
  const openUsersTable = () => {
    setUsersTable(true);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRefresh = () => {
    // Обновляем флаг для вызова обновления данных в MailManager
    setRefreshFlag(!refreshFlag);
  };


  return (
    <>
    <CssBaseline />
      <Container>
        <Header
          showMenu={() => setMenuOpen(true)}
          refresh={handleRefresh}
          showPersonal={openPeronal}
          showSignUp={openSignUp}
          showUsersTable={openUsersTable}
          />
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {displayItem === 'EventTable' && (
          <EventTable
            showSnack={(title, message)=>handleShowSnack(title, message)}
            search={search}
            updateEvents={updateEvents}
            setLoading={setLoading}
          />
        )}
        {displayMail === 'MailManager' && (
          <MailManager
            events={events}
            contacts={contacts}
            search={search}
          />
        )}
        <Accordion sx={{ backgroundColor: 'grey.200' }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography title="open/close mail status">Tabla de respuestas</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <MailManager
              events={events}
              contacts={contacts}
              search={search}
              setLoading={setLoading}
              refreshFlag={refreshFlag}
              updateMailLists={updateMailLists}
             />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: 'grey.200' }} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography title="open/close ">Remitente de invitaciones</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <Remitente
                contacts={contacts}
                events={events}
                showSnack={(title, message)=>handleShowSnack(title, message)}
                mailLists={mailLists}
              />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: 'grey.200' }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography title="open/close events">Gestión de eventos</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <EventTable
                showSnack={handleShowSnack}
                search={search}
                updateEvents={updateEvents}
                setLoading={setLoading}
                refreshFlag={refreshFlag}
              />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: 'grey.200' }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography  title="open/close contacts">Gestión de сontactos</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <ContactTable
                showSnack={(title, message)=>handleShowSnack(title, message)}
                search={search}
                lists={lists}
                updateContacts={updateContacts}
                setLoading={setLoading}
                refreshFlag={refreshFlag}
              />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: 'grey.200' }} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography title="open/close directory">Directorio de campos de contacto</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <ListManager
                showSnack={(title, message)=>handleShowSnack(title, message)}
                search={search}
                updateLists={updateLists}
                setLoading={setLoading}
                refreshFlag={refreshFlag}
              />
          </AccordionDetails>
        </Accordion>
        </Container>
        {showPersonal && (
          <ProfilePage
            showSnack={(title, message)=>handleShowSnack(title, message)}
            open={open}
            close={()=>setShowPersonal(false)}
          />
        )}
        {showSignUp && (
          <SignUp
            showSnack={handleShowSnack}
            open={open}
            close={()=>setShowSignUp(false)}
          />
        )}
        {showUsersTable && (
          <UsersTable
            showSnack={handleShowSnack}
            open={open}
            close={()=>setUsersTable(false)}
          />
        )}
        <Snack
          snackOpen={snackOpen}
          handleClose={()=>setSnackOpen(false)}
          message={snackMessage}
          title={snackTitle}
        />
        <ShowBackdrop
          loading={loading}
          setLoading={setLoading}
        />

    </>
  )
}

export default Home
