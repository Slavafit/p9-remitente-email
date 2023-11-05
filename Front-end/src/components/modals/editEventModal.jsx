import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Paper from '@mui/material/Paper';

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

    // const formatDate = (dateString) => {
    //   const date = new Date(dateString);
    //   return date.toLocaleString(); // Можете использовать другие методы форматирования даты
    // };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
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
                  padding: 3,
                  borderRadius: 5,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)', 
                  backgroundColor: 'grey.300'
                  }}>
      <DialogContent>
        <DialogContentText>Enter the new event details:</DialogContentText>
        <TextField
        sx={{ margin: 1 }}
        label="name" 
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
          label="Image URL" 
          fullWidth
          value={image}
          onChange={handleImageChange}
        />
        <TextField
          sx={{ margin: 1 }}
          // label="Start Date" 
          fullWidth
          type="datetime"
          value={formatDate(startDate)}
          onChange={handleStartDateChange}
        />
        <TextField
          sx={{ margin: 1 }}
          label="Adress" 
          fullWidth
          type="adress"
          value={adress}
          onChange={handleAdressChange}
        />
      </DialogContent>
      </Paper>
      <DialogActions>
        <Button onClick={editClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onSubmit(eventData)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEnventModal;