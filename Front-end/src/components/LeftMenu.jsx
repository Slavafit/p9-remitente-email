import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/List';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import ListItemButton from '@mui/material/ListItemButton';


export default function LeftMenu( props ) {
    const {
        menuOpen,
        menuClose = Function.prototype,
        onEventTable,
        onMailItem,
    } = props;

  return (
    <Drawer
        anchor='left'
        open={menuOpen}
        onClose={menuClose}
    > 
        <Paper sx={{width: '190px', maxWidth: '100%'}}>
            <MenuList>
                <ListItemButton>
                    <ListItem onClick={onMailItem}>
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mail" />
                    </ListItem>
                </ListItemButton>
                <Divider/>
                <ListItemButton>
                    <ListItem onClick={onEventTable}>
                        <ListItemIcon>
                            <EventIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Events" />
                    </ListItem>
                </ListItemButton>
            </MenuList>
        </Paper >
 
    </Drawer>
  );
}
