import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs from 'dayjs';



const EditEnventModal = ({ editOpen, editClose, onSubmit, initName, initDescrip, initImage, initStartDate, initAdress }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [adress, setAdress] = useState('');

  useEffect(() => {
    setName(initName);
    setDesc(initDescrip);
    setImage(initImage);
    setStartDate(initStartDate);
    setAdress(initAdress);}, 
    [initName],
    [initDescrip],
    [initImage],
    [initStartDate],
    [initAdress]
  );

    // Обработчик изменения значения name
    const handleNameChange = (event) => {
      setName(event.target.value);
    };
  
    // Обработчик изменения значения description
    const handleDiscChange = (event) => {
      setDesc(event.target.value);
    };

    const handleImageChange = (event) => {
      setImage(event.target.value);
    };
  
    const handleStartDateChange = (event) => {
      setStartDate(event.target.value);
    };


    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    const handleAdressChange = (event) => {
      setAdress(event.target.value);
    };
    

    const eventData = {
      name: name,
      description: desc,
      image: image,
      startDate: startDate,
      adress: adress
    };

  return (
    <Dialog open={editOpen} onClose={editClose}>
      <DialogTitle>Edit event</DialogTitle>
      <Paper sx={{
                  m:3,
                  padding: 2,
                  borderRadius: 5,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)', 
                  backgroundColor: 'grey.300'
                  }}>
      <DialogContent>
        <DialogContentText>Enter the new event details:</DialogContentText>
        <TextField
        sx={{ margin: 1 }}
        label="name" 
        type="text"
        fullWidth
        value={name}
        onChange={handleNameChange}
        />
        <TextField
        sx={{ margin: 1 }}
        label="description" 
        fullWidth
        value={desc}
        onChange={handleDiscChange}
        />
        <TextField
          sx={{ margin: 1 }}
          type="text"
          label="Image URL" 
          fullWidth
          value={image}
          onChange={handleImageChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DesktopDateTimePicker
            sx={{ width: '100%', margin: 1 }}
            label="New Date and Time"
            value={formatDate(startDate)}
            onChange={handleStartDateChange}
          />
            <Typography>
              Date and Time: {formatDate(startDate)}
            </Typography>
        </LocalizationProvider>
        <TextField
          sx={{ margin: 2 }}
          label="Adress" 
          fullWidth
          type="adress"
          value={adress}
          onChange={handleAdressChange}
        />
      </DialogContent>
      </Paper>
      <DialogActions>
        <Button onClick={editClose} variant="outlined" color="success">
          Cancel
        </Button>
        <Button onClick={() => onSubmit(eventData)} variant="outlined" color="success">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEnventModal;