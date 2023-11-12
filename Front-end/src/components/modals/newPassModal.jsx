import React, { useState } from "react";
import {  DialogTitle } from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const NewPasswordModal = ({ resetOpen, handleClose, onSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");


  const handleNewPassChange = (event) => {
    const password = event.target.value;
    if (password.length < 6 || password.length > 20) {
      setError("La contraseña debe tener entre 6 y 20 caracteres.");
    } else {
      setError("");
    }
    setNewPassword(password);
  };

  const handleConfirmPassChange = (event) => {
    const confirmPassword = event.target.value;
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      setError("");
    }
    setConfirmPass(confirmPassword);
  };

  const handleSubmit = () => {
    if (newPassword === confirmPass) {
      onSubmit(newPassword);
    } else {
      setError("Las contraseñas no coinciden");
    }
  };

  return (
    <Dialog open={resetOpen} onClose={handleClose}>

      <DialogContent sx={{padding: 3, backgroundColor: 'grey.300'}}>
      <DialogTitle>Nueva contraseña</DialogTitle>
        <Box
            sx={{
              padding: 3,
              borderRadius: 5,
              gap:2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "Menu",
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
            }}
          >
        <DialogContentText>Ingrese la nueva contraseña:</DialogContentText>
        <TextField
          sx={{ margin: 1 }}
          label="Nueva contraseña" 
          fullWidth
          value={newPassword}
          onChange={handleNewPassChange}
          error={error.length > 0}
          helperText={error}
        />
        <TextField
          sx={{ margin: 1 }}
          label="Confirmar contraseña" 
          fullWidth
          value={confirmPass}
          onChange={handleConfirmPassChange}
          error={error.length > 0}
          helperText={error}
        />
      </Box>
        <DialogActions sx={{ my:2}}>
          <Button onClick={() => {
            handleClose();
            setNewPassword("");
            setConfirmPass("");
            setError("");
          }}
          variant="outlined" 
          color="success" 
          >
            Cancelar
          </Button>
          <Button variant="outlined" color="success" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default NewPasswordModal;
