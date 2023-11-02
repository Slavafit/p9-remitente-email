import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useState  } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, eventName, theme) {
  return {
    fontWeight:
    eventName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({events}) {
  const theme = useTheme();
  const [eventName, setEventName] = React.useState([]);
  const [isFocused, setIsFocused] = useState(false);
  
  // console.log(events);
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
        setEventName([events[index].name]);
      }
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="event-name">Event</InputLabel>
        <Select
          labelId="event-name"
          value={eventName}
          onChange={handleChange}
          input={<OutlinedInput label="Event" />}
          MenuProps={MenuProps}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
          >
          {events.map((event) => (
            <MenuItem
              key={event._id}
              value={event.name}
              style={getStyles(event.name, eventName, theme)}
            >
              {event.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
