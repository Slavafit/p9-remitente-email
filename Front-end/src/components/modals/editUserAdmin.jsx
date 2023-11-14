import React, { useState, useEffect } from "react";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const EditModalAdmin = ({ editOpen, handleClose, onSubmit, selectedUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  
  useEffect(() => {
    if (selectedUser) {
      setUsername(selectedUser.username || ""); // Установка значения username
      setEmail(selectedUser.email || ""); // Установка значения email
      setRol(selectedUser.roles || "");
    }
  }, [selectedUser]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleRolChange = (event) => {
    setRol(event.target.value);
  };

  return (
    <Dialog open={editOpen} onClose={handleClose}>
      <DialogContent sx={{padding: 3, backgroundColor: 'grey.300'}}>
      <Box
          sx={{
            padding: 5,
            borderRadius: 5,
            gap:2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "Menu",
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
          }}
        >
        <DialogTitle>
          Edite su perfil
          </DialogTitle>
        <DialogContentText>Introduce nuevos datos:</DialogContentText>
        <TextField
          sx={{ margin: 1 }}
          label="Nombre de usuario" 
          fullWidth
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          sx={{ margin: 1 }}
          label="Email" 
          fullWidth
          value={email}
          onChange={handleEmailChange}
        />
        <Select
          value={rol}
          onChange={handleRolChange}
          label="Role"
          fullWidth
        >
          <MenuItem value={"USER"}>USER</MenuItem>
          <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
        </Select>
      </Box>
        <DialogActions sx={{ my:2}}>
          <Button onClick={() => {
            handleClose();
            setUsername("");
            setEmail("");
            setRol("");
          }}
          variant="outlined"
          color="success">
            Cancelar
          </Button>
          <Button onClick={() => onSubmit(username, email, rol)} 
          variant="outlined"
          color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditModalAdmin;
