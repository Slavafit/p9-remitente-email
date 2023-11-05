import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Avatar, Box, Container, Grid, Typography, IconButton,
} from "@mui/material";;
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "./service/AuthContext";
import { addTokenToHeaders } from "./service/AuthUser";
import EditUserProfile from "./components/modals/editUserModal";
import DeleteUserModal from "./components/modals/deleteUserModal";

const WallPaper = styled('div')(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(rgb(40, 0, 0) 0%, rgb(20, 0, 0) 100%)'
    : 'linear-gradient(rgb(0, 255, 255) 0%, rgb(0, 128, 128) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&:before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(at center center, rgb(120, 0, 0) 0%, rgba(120, 0, 0, 0) 64%)'
      : 'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
  },
  '&:after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(at center center, rgb(140, 0, 0) 0%, rgba(140, 0, 0, 0) 70%)'
      : 'radial-gradient(at center center, rgb(255, 255, 0) 0%, rgba(255, 255, 0, 0) 70%)',
    transform: 'rotate(30deg)',
  },
}));

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 15,
  width: '100%',
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
}));

const ProfilePage = ({showSnack}) => {
  const [users, setUsers] = useState(true);
  let username = localStorage.getItem("username");
  const [editOpen, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // console.log("personal: ", selectedList);
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
      // console.log(response.data.user);
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
        logout();
        navigate('/');
      } catch (error) {
        console.error("Error delete user:", error);
      }
    };

  
    //метод редактирования
    const handleEditUser = async (newUsername, newEmail) => {
      try {
        const id = users._id
        const userData = {
          username: newUsername,
          email: newEmail,
        };
        addTokenToHeaders();
        setLoading(true);
        const response = await axios.put(
          `http://localhost:5000/users/?_id=${id}`, userData );
        
        setUsers(response.data);
        let username = response.data.username;
        let email = response.data.email;
        localStorage.setItem('username', username);
        setOpen(false)
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };
    



  return (
    <>
      <Container maxWidth="md">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={3}>
            <Widget>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "primary.main",
                    // marginBottom: 2,
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
                  <IconButton onClick={() => setOpen(true)}>
                    <EditRoundedIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteOpen(true)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Widget>
          </Grid>
        </Grid>

        {/* <WallPaper /> */}
      </Container>
      <EditUserProfile
        editOpen={editOpen}
        handleClose={() => setOpen(false)}
        onSubmit={handleEditUser}
        initialUsername={users.username || ""}
        initialEmail={users.email || ""}
        />
        <DeleteUserModal
        deleteOpen={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteUser}
        />
    </>                 
  );
};

export default ProfilePage;
