import React, { useState } from 'react'
import { Container } from "@mui/material"
import Header from "./components/Header"
import LeftMenu from "./components/LeftMenu"
import Search from './components/Search'
import EventTable from './components/EventItem';
import CssBaseline from '@mui/material/CssBaseline';
import Snack from './components/Snack';
import MailItem from './components/MailItem';
import ProfilePage from './Personal';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContactTable from './components/Contacts'
import ListManager from './components/ListManager'





function Home() {
  const [isMenuOpen, setMenuOpen] = useState()
  const [search, setSearch] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('');
  const [displayItem, setDisplayItem] = useState('');
  const [displayMail, setDisplayMail] = useState(''); 
  const [showPersonal, setShowPersonal] = useState(); 
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [lists, setLists] = useState({});

  const handleShowSnack = (message) => {
    setSnackMessage(message);
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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
    <CssBaseline />
      <Container>
        <Header
          showMenu={() => setMenuOpen(true)}
          refresh={updateEvents}
          showPersonal={() => {
            setDisplayItem(null);
            setDisplayMail(null);
            setShowPersonal(true);
          }}
          />
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {displayItem === 'EventTable' && (
          <EventTable
            showSnack={handleShowSnack}
            search={search}
            updateEvents={updateEvents}
          />
        )}
        {displayMail === 'MailItem' && (
          <MailItem
            events={events}
          />
        )}
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Mail</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <MailItem events={events} />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Events</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <EventTable
                showSnack={handleShowSnack}
                search={search}
                updateEvents={updateEvents}
              />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Contacts</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <ContactTable
                showSnack={handleShowSnack}
                search={search}
                lists={lists}
              />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>List manager</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <ListManager
                showSnack={handleShowSnack}
                search={search}
                updateLists={updateLists}
              />
          </AccordionDetails>
        </Accordion>
        </Container>
        <LeftMenu
          menuOpen={isMenuOpen}
          menuClose={() => setMenuOpen(false)}
          onEventTable={() => {
            setDisplayItem('EventTable'); // При выборе EventTable скрываем MailItem
            setDisplayMail(null);
            setShowPersonal(null);
          }}
          onMailItem={() => {
            setDisplayMail('MailItem'); // При выборе MailItem скрываем EventTable
            setDisplayItem(null);
            setShowPersonal(null);
          }}
        />
          {showPersonal && (
            <ProfilePage
              menuClose={() => setShowPersonal(false)}
              showSnack={handleShowSnack}
            />
          )}
        <Snack
          snackOpen={snackOpen}
          handleClose={()=>setSnackOpen(false)}
          message={snackMessage}
        />


    </>
  )
}

export default Home
