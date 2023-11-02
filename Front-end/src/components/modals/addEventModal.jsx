import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';

const AddEventModal = ({ open, onSubmit, close }) => {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    image: '',
    startDate: '',
    adress: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };
  // функция обновления состояния полей
  const handleAddClick = () => {
    onSubmit(eventData);
    setEventData({
      name: '',
      description: '',
      image: '',
      startDate: '',
      adress: '',
    });
    // console.log(eventData)
  };

  //функция сохранения изображения
  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setEventData({
        ...eventData,
        image: reader.result, // Здесь будет строка base64
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  
  //функция изменения даты и времени:
  const handleDateTimeChange = (newDateTime, field) => {
    setEventData({
      ...eventData,
      [field]: newDateTime,
    });
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Event</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            gap: '20px',
            }}
          >
          <DialogContentText>Fill in the fields for the new event:</DialogContentText>
          <TextField
            required
            label="Event Name"
            name="name"
            type="Text"
            value={eventData.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Event description"
            name="description"
            type="Textarea"
            value={eventData.description}
            onChange={handleInputChange}
          />
          <TextField
            required
            label="Event Image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DesktopDateTimePicker
              label="Start Date and Time"
              value={eventData.startDate}
              defaultValue={dayjs('2023-10-30T15:30')}
              onChange={(newDate) => handleDateTimeChange(newDate, 'startDate')}
              renderInput={(params) => <TextField {...params} />}
              />
          </LocalizationProvider>
          <TextField
            label="Event adress"
            name="adress"
            type="Text"
            value={eventData.adress}
            onChange={handleInputChange}
          />
        </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddClick} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEventModal;
