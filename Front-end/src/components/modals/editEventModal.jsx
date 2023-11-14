import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Paper from '@mui/material/Paper';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';


const EditEnventModal = ({ editOpen, editClose, onSubmit, initName, initDescrip, initImage, initStartDate, initAddress }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [adress, setAddress] = useState('');

  useEffect(() => {
    setName(initName);
    setDesc(initDescrip);
    setImage(initImage);
    setStartDate(initStartDate);
    setAddress(initAddress);}, 
    [initName],
    [initDescrip],
    [initImage],
    [initStartDate],
    [initAddress]
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
  
    const handleStartDateChange = (newDate) => {
      setStartDate(newDate);
    };

  

    const handleAdressChange = (event) => {
      setAddress(event.target.value);
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
      <DialogContent sx={{padding: 3, backgroundColor: 'grey.300'}}>
        <DialogTitle>Editar evento</DialogTitle>
        <Paper sx={{
              
              padding: 1,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              gap: '20px',
              bgcolor: "Menu",
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)' 
                    }}>
        <DialogContent>
          <DialogContentText sx={{ m:2}}>Ingrese los detalles del nuevo evento:</DialogContentText>
          <TextField
          sx={{ margin: 1 }}
          label="Nombre del evento" 
          type="text"
          fullWidth
          value={name}
          onChange={handleNameChange}
          />
          <TextField
          sx={{ margin: 1 }}
          label="descripción del evento" 
          fullWidth
          value={desc}
          onChange={handleDiscChange}
          />
          <TextField
            sx={{ margin: 1 }}
            type="text"
            label="Imagen URL" 
            fullWidth
            value={image}
            onChange={handleImageChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DesktopDateTimePicker
              sx={{ width: '100%', margin: 1 }}
              label="Nueva fecha y hora"
              value={dayjs(startDate)}
              onChange={handleStartDateChange}
            />
          </LocalizationProvider>
          <TextField
            sx={{ width: '100%', margin: 1 }}
            label="Dirección" 
            fullWidth
            type="adress"
            value={adress}
            onChange={handleAdressChange}
          />
        </DialogContent>
        </Paper>
        <DialogActions sx={{mt:1}}>
          <Button onClick={editClose} variant="outlined" color="success">
            Cancelar
          </Button>
          <Button onClick={() => onSubmit(eventData)} variant="outlined" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnventModal;