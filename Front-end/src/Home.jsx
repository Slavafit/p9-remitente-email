import { useState, useRef  } from 'react'
import { Container } from "@mui/material"
import { styled } from '@mui/material/styles';
import Header from "./components/Header"
import LeftMenu from "./components/LeftMenu"
import Search from './components/Search'
import EventTable from './components/EventItem';
import CssBaseline from '@mui/material/CssBaseline';
import Snack from './components/Snack';
import MailItem from './components/MailItem';



const WallPaper = styled('div')(({ theme }) => ({
  position: 'relative',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

function Home() {
  const [isMenuOpen, setMenuOpen] = useState()
  const [search, setSearch] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('');
  const eventItemRef = useRef();
  const [displayItem, setDisplayItem] = useState('MailItem');
  const [displayMail, setDisplayMail] = useState('MailItem'); 

  const handleShowSnack = (message) => {
    setSnackMessage(message);
    setSnackOpen(true);
  };

  const refreshEvents = () => {
    if (eventItemRef.current && eventItemRef.current.refresh) {
      eventItemRef.current.refresh();
    }
  };

  return (
    <>
    <CssBaseline />
      <Container>
        <Header
          showMenu={() => setMenuOpen(true)}
          refresh={refreshEvents}
          />
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {displayItem === 'EventTable' && (
          <EventTable
            showSnack={handleShowSnack}
            ref={eventItemRef}
          />
        )}
        {displayMail === 'MailItem' && (
          <MailItem/>
        )}
        <WallPaper/>
        </Container>
        <LeftMenu
          menuOpen={isMenuOpen}
          menuClose={() => setMenuOpen(false)}
          onEventTable={() => {
            setDisplayItem('EventTable'); // При выборе EventTable скрываем MailItem
            setDisplayMail(null);
          }}
          onMailItem={() => {
            setDisplayMail('MailItem'); // При выборе MailItem скрываем EventTable
            setDisplayItem(null);
          }}
        />
        <Snack
          snackOpen={snackOpen}
          handleClose={()=>setSnackOpen(false)}
          message={snackMessage}
        />
    </>
  )
}

export default Home
