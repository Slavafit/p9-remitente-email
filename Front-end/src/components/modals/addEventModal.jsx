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
      <DialogContent sx={{padding: 3, backgroundColor: 'grey.300'}}>
        <DialogTitle>Add Event</DialogTitle>
          <DialogContent
            sx={{
              padding: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              gap: '20px',
              bgcolor: "Menu",
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
              }}
            >
            <DialogContentText sx={{mt:1}}>Fill in the fields for the new event:</DialogContentText>
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
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="DE">
              <DesktopDateTimePicker
                label="Start Date and Time"
                value={eventData.startDate}
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
        <DialogActions sx={{mt:1}}>
          <Button onClick={close} variant="outlined" color="success" >
            Cancel
          </Button>
          <Button onClick={handleAddClick} variant="outlined" color="success">
            Add
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
