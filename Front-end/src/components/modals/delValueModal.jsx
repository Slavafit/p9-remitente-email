import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DeleteValueModal = ({ deleteOpen, deleteClose, onDelete }) => {
  return (
    <Dialog open={deleteOpen} onClose={deleteClose}>
      <DialogTitle>Borrar valor</DialogTitle>
      <DialogContent>
        <DialogContentText>
        ¿Estás seguro de que deseas eliminar este valor? <br />Esta acción no se puede realizar.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteClose} variant="outlined" color="success">
          Cancelar
        </Button>
        <Button onClick={onDelete}  variant="outlined" color="primary">
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteValueModal;
