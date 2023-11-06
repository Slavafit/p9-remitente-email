import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Avatar, Box, Typography, IconButton,   Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider
} from "@mui/material";
import axios from "axios";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { addTokenToHeaders } from "./service/AuthUser";
import EditModal from "./components/modals/editUserModal";
import DeleteUserModal from "./components/modals/deleteUserModal";


const ProfilePage = ( {showSnack, open, close} ) => {
  const [users, setUsers] = useState(true);
  let username = localStorage.getItem('username');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // console.log("personal: ", username);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      addTokenToHeaders();
      const response = await axios.get(
        `http://localhost:5000/personal/?username=${username}`
      );
      setUsers(response.data.user);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  
    //блок удаления пользователя
    const handleDeleteUser = async () => {
      try {
        const id = users._id
        addTokenToHeaders();
        await axios.delete(`http://localhost:5000/users/?_id=${id}`);
        setDeleteOpen(false);
      } catch (error) {
        console.error("Error delete user:", error);
      }
    };

  
    //метод редактирования

    const handleEditUser = (user) => {
      setSelectedUser(user);
      setEditOpen(true);
    };
    const editUser = async (newUsername, newEmail) => {
      try {
        const id = users._id
        const userData = {
          username: newUsername,
          email: newEmail,
        };
        addTokenToHeaders();
        const response = await axios.put(
          `http://localhost:5000/users/?_id=${id}`, userData );
        setUsers(response.data);
        let username = response.data.username;
        localStorage.setItem('username', username);
        setEditOpen(false)
        showSnack(`User ${username} updated successfully` );
      } catch (error) {
        console.error("Error updating user:", error);
        const resError = error.response.data.errors[0];
        console.log(resError.message);
        showSnack(resError.message);
      }
    };
    


  return (
    <>
      <Dialog open={open} onClose={close}>
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
            <Avatar title={users.username}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
              }}
            >
              {username.charAt(0)}
            </Avatar>
              <Typography variant="h5" component="h1">
                {users.username}
              </Typography>
              <Typography variant="subtitle1" component="p">
                {users.email}
              </Typography>
              <Box>
                <IconButton onClick={() => handleEditUser(users)}>
                  <EditRoundedIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
        <DialogActions sx={{flexDirection: 'column', gap:2, my:2}}>
          <Button 
          fullWidth
          variant="text"
          onClick={close} 
          color="success">
            Cancel
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
        <EditModal
        editOpen={editOpen}
        handleClose={() => setEditOpen(false)}
        onSubmit={editUser}
        selectedUser={selectedUser}
        />
        <DeleteUserModal
        deleteOpen={deleteOpen}
        deleteClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteUser}
        />
    </>                 
  );
};

export default ProfilePage;
