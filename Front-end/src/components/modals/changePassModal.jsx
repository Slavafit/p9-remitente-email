import React, { useState } from "react";
import {  DialogTitle } from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
const ChangePasswordModal = ({ resetOpen, handleClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const handleOldPassChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPassChange = (event) => {
    const password = event.target.value;
    if (password.length < 6 || password.length > 20) {
      setError("Password must be between 6 and 20 characters");
    } else {
      setError("");
    }
    setNewPassword(password);
  };

  const handleConfirmPassChange = (event) => {
    const confirmPassword = event.target.value;
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
    setConfirmPass(confirmPassword);
  };

  const handleSubmit = () => {
    if (newPassword === confirmPass) {
      onSubmit(oldPassword, newPassword);
    } else {
      setError("Las contraseñas no coinciden");
    }
  };

  return (
    <Dialog open={resetOpen} onClose={handleClose}>

      <DialogContent sx={{padding: 3, backgroundColor: 'grey.300'}}>
      <DialogTitle>Editar contraseña</DialogTitle>
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
          label="Contraseña anterior" 
          fullWidth
          value={oldPassword}
          onChange={handleOldPassChange}
        />
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
            setOldPassword("");
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

export default ChangePasswordModal;
