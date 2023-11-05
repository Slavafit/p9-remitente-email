import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';


const AddContactModal = ({ open, onSubmit, close, lists }) => {
  const [contactData, setContacts] = useState({
    nombre: '',
    cargo: '',
    entidad: '',
    categoria: '',
    provincia: '',
    territorio: '',
    email: '',
    telefono: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContacts({
      ...contactData,
      [name]: value,
    });
  };
  // функция обновления состояния полей
  const handleAddClick = () => {
    onSubmit(contactData);
    setContacts({
      nombre: '',
      cargo: '',
      entidad: '',
      categoria: '',
      provincia: '',
      territorio: '',
      email: '',
      telefono: '',
    });
  };

  //проверки для поля telefono
  const handleTelefonoChange = (e) => {
    const { value } = e.target;
    const telefonoRegex = /^[+0-9]{1,12}$/;
    if (telefonoRegex.test(value)) {
      setContacts({
        ...contactData,
        telefono: value,
      });
    }
  };


  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add new contact</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            gap: '20px',
            m: 3,
            // backgroundColor: 'grey.200'
            }}
          >
          <DialogContentText>Fill in the fields for the new contact:</DialogContentText>
          <TextField
            required
            label="Nombre"
            name="nombre"
            type="Text"
            value={contactData.nombre}
            onChange={handleInputChange}
          />
          <FormControl variant="outlined">
          <InputLabel>Cargo</InputLabel>
            <Select
              label="cargo"
              name="cargo"
              value={contactData.cargo}
              onChange={handleInputChange}
            >
              {lists && lists.cargo && lists.cargo.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          <FormControl variant="outlined">
          <InputLabel>Entidad</InputLabel>
            <Select
              label="entidad"
              name="entidad"
              value={contactData.entidad}
              onChange={handleInputChange}
            >
              {lists && lists.entidad && lists.entidad.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            <FormControl variant="outlined">
            <InputLabel>Categoria</InputLabel>
            <Select
              label="categoria"
              name="categoria"
              value={contactData.categoria}
              onChange={handleInputChange}
              
            >
              {lists && lists.categoria && lists.categoria.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            <FormControl variant="outlined">
            <InputLabel>Provincia</InputLabel>
            <Select
              label="provincia"
              name="provincia"
              value={contactData.provincia}
              onChange={handleInputChange}
            >
            {lists && lists.provincia && lists.provincia.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
            </Select>
            </FormControl>
            <FormControl variant="outlined">
            <InputLabel>Territorio</InputLabel>
            <Select
              label="territorio"
              name="territorio"
              value={contactData.territorio}
              onChange={handleInputChange}
            >
              {lists && lists.territorio && lists.territorio.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          <TextField
            required
            label="email"
            name="email"
            type="email"
            value={contactData.email}
            onChange={handleInputChange}
          />
          <TextField
            label="telefono"
            name="telefono"
            type="Text"
            value={contactData.telefono}
            onChange={handleTelefonoChange}
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

export default AddContactModal;
