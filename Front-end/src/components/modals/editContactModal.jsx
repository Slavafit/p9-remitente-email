import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
  FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const EditContactModal = ({ 
  editOpen, editClose, onSubmit, lists, initNombre, initCargo, 
  initEntidad, initCategoria, initProvincia, initTerritorio, initEmail, initTelefono

  }) => {
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [entidad, setEntidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [provincia, setProvincia] = useState('');
  const [territorio, setTerritorio] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    setNombre(initNombre);
    setCargo(initCargo);
    setEntidad(initEntidad);
    setCategoria(initCategoria);
    setProvincia(initProvincia); 
    setTerritorio(initTerritorio);
    setEmail(initEmail); 
    setTelefono(initTelefono);}, 
    [initNombre],
    [initCargo],
    [initEntidad],
    [initCategoria],
    [initProvincia],
    [initTerritorio],
    [initEmail],
    [initTelefono],
  );

    // Обработчик изменения значения
    const handleNombreChange = (e) => {
      setNombre(e.target.value);
    };
    const handleCargoChange = (e) => {
      setCargo(e.target.value);
    };
    const handleEntidadChange = (e) => {
      setEntidad(e.target.value);
    };
    const handleCatChange = (e) => {
      setCategoria(e.target.value);
    };
    const handleProvinciaChange = (e) => {
      setProvincia(e.target.value);
    };
    const handleTerritorioChange = (e) => {
      setTerritorio(e.target.value);
    };
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
    const handleTelChange = (e) => {
      setTelefono(e.target.value);
    };

    const contactData = {
      nombre: nombre,
      cargo: cargo,
      entidad: entidad,
      categoria: categoria,
      provincia: provincia,
      territorio: territorio,
      email: email,
      telefono: telefono
    };

  return (
    <Dialog open={editOpen} onClose={editClose}>
      <DialogContent sx={{padding: 3, bgcolor: 'grey.300', }}>
        <DialogTitle>Editar contacto</DialogTitle>
        <DialogContent
            sx={{
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              gap: '10px',
              bgcolor: "Menu",
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
              m: 2,
              }}
            >
          <DialogContentText sx={{mt:1}}>Introduzca los nuevos datos de contacto:</DialogContentText>
          <TextField
          sx={{ margin: 1 }}
          label="nombre"
          name="nombre"
          fullWidth
          value={nombre}
          onChange={handleNombreChange}
          />
            <FormControl variant="outlined" sx={{ m: 1, width: '100%' }}>
            <InputLabel>Cargo</InputLabel>
              <Select
                label="cargo"
                name="cargo"
                value={contactData.cargo}
                onChange={handleCargoChange}
              >
                {lists && lists.cargo && lists.cargo.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, width: '100%' }}>
            <InputLabel>Entidad</InputLabel>
              <Select
                label="entidad"
                name="entidad"
                value={contactData.entidad}
                onChange={handleEntidadChange}
              >
                {lists && lists.entidad && lists.entidad.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, width: '100%' }}>
            <InputLabel>Categoria</InputLabel>
              <Select
                label="categoria"
                name="categoria"
                value={contactData.categoria}
                onChange={handleCatChange}
              >
                {lists && lists.categoria && lists.categoria.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, width: '100%' }}>
            <InputLabel>Provincia</InputLabel>
              <Select
                label="provincia"
                name="provincia"
                value={contactData.provincia}
                onChange={handleProvinciaChange}
              >
                {lists && lists.provincia && lists.provincia.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, width: '100%' }}>
            <InputLabel>Territorio</InputLabel>
              <Select
                label="territorio"
                name="territorio"
                value={contactData.territorio}
                onChange={handleTerritorioChange}
              >
                {lists && lists.territorio && lists.territorio.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>

          <TextField
            sx={{ margin: 1, width: '100%' }}
            label="Email" 
            fullWidth
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            sx={{ margin: 1, width: '100%' }}
            label="telefono" 
            fullWidth
            type="telefono"
            value={telefono}
            onChange={handleTelChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={editClose} variant='outlined' color="success">
            Cancelar
          </Button>
          <Button onClick={() => onSubmit(contactData)}  variant='outlined' color="primary">
            Guardar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactModal;