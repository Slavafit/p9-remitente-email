import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Avatar, Box, Container, Grid, Typography, IconButton,
} from "@mui/material";;
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { addTokenToHeaders } from "./Service/AuthUser";
import EditUserProfile from "./components/modals/editUserModal";
import DeleteUserModal from "./components/modals/deleteUserModal";



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
// const defaultTheme = createTheme();

const ProfilePage = ( {showSnack} ) => {
  const [users, setUsers] = useState(true);
  let username = localStorage.getItem('username');
  const [loading, setLoading] = useState(true);
  const [editOpen, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // console.log("personal: ", username);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      addTokenToHeaders();
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/personal/?username=${username}`
      );
      setUsers(response.data.user);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
        localStorage.setItem('username', username);
        setLoading(false);
        setOpen(false)
        showSnack(`User ${username} updated successfully` );
      } catch (error) {
        setLoading(false);
        console.error("Error updating user:", error);
      }
    };
    

  //блок ошибок загрузки
  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

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
                  {users.username.charAt(0)}
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
        <EditUserProfile
        editOpen={editOpen}
        handleClose={() => setOpen(false)}
        onSubmit={handleEditUser}
        initialUsername={users.username || ""}
        initialEmail={users.email || ""}
        />
        <DeleteUserModal
        deleteOpen={deleteOpen}
        deleteClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteUser}
        />
      </Container>
    </>                 
  );
};

export default ProfilePage;
