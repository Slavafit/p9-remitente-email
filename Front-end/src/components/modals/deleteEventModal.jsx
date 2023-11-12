import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DeleteEventModal = ({ deleteOpen, handleClose, onDelete }) => {
  return (
    <Dialog open={deleteOpen} onClose={handleClose}>
      <DialogTitle>Delete event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this event? <br />This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEventModal;
