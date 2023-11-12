import React, { useState, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteIcon from "@mui/icons-material/Delete";
import { addTokenToHeaders } from "./service/addTokenToHeaders";
import EditModal from "./components/modals/editUserModal";
import DeleteUserModal from "./components/modals/deleteUserModal";
import ChangePasswordModal from "./components/modals/changePassModal";


const ProfilePage = ( {showSnack, open, close} ) => {
  const [users, setUsers] = useState(true);
  let username = sessionStorage.getItem('username');
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
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
        showSnack(`Usuario "${username}" actualizado exitosamente` );
      } catch (error) {
        if ( error.response.data && error.response.data.message) {
          const resError = error.response.data.message;
          showSnack('warning', resError);
      } else if ( error.response.data.errors && error.response.data.errors.length > 0) {
          const resError = error.response.data.errors[0].message;
          showSnack('warning', resError);
      } else {
          console.error("Error updating user:", error);
          showSnack('warning', 'Error updating user');
        }
      }
    };


    //Change password
    const handleResetPass = (user) => {
      setSelectedUser(user);
      setResetOpen(true);
    };
    const resetPassword = async (oldPassword, newPassword) => {
      try {
        const id = users._id
        const userData = {
          oldPassword: oldPassword,
          newPassword: newPassword,
        };
        // console.log(id,userData);
        addTokenToHeaders();
        const response = await axios.post(
          `http://localhost:5000/changepassword/${id}`, userData 
          );
        setResetOpen(false)
        showSnack('success', `Password updated successfully` );
      } catch (error) {
        if ( error.response.data && error.response.data.message) {
          const resError = error.response.data.message;
          // showSnack(resError);
          showSnack('warning', resError);
      } else if ( error.response.data.errors && error.response.data.errors.length > 0) {
          const resError = error.response.data.errors[0].message;
          showSnack('warning', resError);
      } else {
          console.error("Error update password:", error);
          showSnack('warning', 'Error update password');
        }
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
                <IconButton title="Cambia tu cuenta"  onClick={() => handleEditUser(users)}>
                  <EditRoundedIcon/>
                </IconButton>
                <IconButton title="Restablecer la contraseña" onClick={() => handleResetPass(true)}>
                  <LockResetIcon fontSize="large"/>
                </IconButton>
                <IconButton title="Elimina tu cuenta" onClick={() => setDeleteOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
        <DialogActions sx={{flexDirection: 'column', gap:2, my:2}}>
          <Button 
          fullWidth
          variant="outlined"
          onClick={close} 
          color="success">
            Cancelar
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
        <ChangePasswordModal
        resetOpen={resetOpen}
        handleClose={() => setResetOpen(false)}
        onSubmit={resetPassword}
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
