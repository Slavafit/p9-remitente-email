import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DeleteValueModal = ({ deleteOpen, deleteClose, onDelete }) => {
  return (
    <Dialog open={deleteOpen} onClose={deleteClose}>
      <DialogTitle>Delete value</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this value? <br />This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteValueModal;
