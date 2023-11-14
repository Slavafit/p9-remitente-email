import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DeleteEventModal = ({ deleteOpen, handleClose, onDelete }) => {
  return (
    <Dialog open={deleteOpen} onClose={handleClose}>
      <DialogTitle>Eliminar evento</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar este evento? <br />Esta acción no se puede realizar.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="success">
          Cancelar
        </Button>
        <Button onClick={onDelete} variant="outlined" color="primary">
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEventModal;
