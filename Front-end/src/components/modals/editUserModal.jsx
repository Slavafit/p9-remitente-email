import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

const EditModal = ({ editOpen, handleClose, onSubmit, initialUsername, initialEmail }) => {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);

    // Обработчик изменения значения username
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);

    };
  
    // Обработчик изменения значения email
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };


  return (
    <Dialog open={editOpen} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the new user details:</DialogContentText>
        <TextField
        sx={{ margin: 1 }}
        label="Username" 
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onSubmit(username, email)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;