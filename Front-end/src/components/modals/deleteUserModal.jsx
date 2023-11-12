import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DeleteUserModal = ({ deleteOpen, deleteClose, onDelete }) => {
  return (
    <Dialog open={deleteOpen} onClose={deleteClose}>
      <DialogTitle>Borrar usuario</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar este usuario? <br />Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onDelete} color="primary">
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
