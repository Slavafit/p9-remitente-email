import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DelContactModal = ({ deleteOpen, handleClose, onDelete }) => {
  return (
    <Dialog open={deleteOpen} onClose={handleClose}>
      <DialogTitle>Delete contact</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this contact? <br />This action cannot be undone.
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

export default DelContactModal;
