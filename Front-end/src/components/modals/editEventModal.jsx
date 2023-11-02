import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

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
    // console.log(eventData);

  return (
    <Dialog open={editOpen} onClose={editClose}>
      <DialogTitle>Edit event</DialogTitle>
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
          value={startDate}
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