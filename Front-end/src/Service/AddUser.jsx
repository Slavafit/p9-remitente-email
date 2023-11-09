import React, { useState } from "react";
import {
  Box, Typography, IconButton, Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { styled } from '@mui/material/styles';
import { addTokenToHeaders } from "./AuthUser";


// const TinyText = styled(Typography)({
//   fontSize: '0.9rem',
//   opacity: 0.7,
//   fontWeight: 500,
//   letterSpacing: 0.2,
//   marginTop: 4,
//   fontFamily: 'monospace',
//   display: 'flex'
// });

export default function SignUp( {showSnack, open, close} ) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessages({
      ...errorMessages,
      [name]: "", // Сбрасываем сообщение об ошибке при изменении поля
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    const form = event.currentTarget;
  
    // Проверяем на пустые поля и устанавливаем сообщения об ошибках при необходимости
    let hasErrors = false;
    const newErrorMessages = { ...errorMessages };
  
    if (formData.username.trim() === "") {
      newErrorMessages.username = "Please provide a username.";
      hasErrors = true;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrorMessages.email = "Please provide an email address.";
      hasErrors = true;
    }
  
    if (formData.password.trim() === "") {
      newErrorMessages.password = "Please provide a password.";
      hasErrors = true;
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrorMessages.confirmPassword = "Passwords do not match.";
      hasErrors = true;
    }
    setErrorMessages(newErrorMessages); // Обновляем сообщения об ошибках
    

    if (!hasErrors) {
      try {
        const response = await axios.post(
          "http://localhost:5000/registration", formData);
        let responseMessage = response.data.message;
        showSnack(responseMessage);
        close();
        // Очистка формы и других состояний
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
  

      } catch (error) {
        if (error.response.data.message) {
          console.error("Server error:", error.response);
          let responseError = error.response.data.error;
          let responseMessage = error.response.data.message;
          showSnack(`Message: ${responseMessage}, Error:  ${responseError}`);
        } else {
          console.error("Error sending data:", error);
          const resMessage = error.response.data.errors[0];
          showSnack(resMessage.message);
        }
      }
    }
  
    form.reset();
  };
  


  return (
    <Dialog open={open} onClose={close}>
      <DialogContent sx={{padding: 3}}>
        <Box
          sx={{
            mt: 0,
            padding: 3,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'grey.300',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Typography component="h1" variant="h5">
            Add new user
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  autoComplete
                  name="username"
                  label="User Name"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errorMessages.username}
                  helperText={
                  errorMessages.username ? (
                      <TinyText sx={{ color: 'red' }}>{errorMessages.username}</TinyText>
                    ) : (
                      <TinyText sx={{ color: 'green' }}>
                        Please provide a username.
                      </TinyText>
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errorMessages.email}
                  helperText={
                    errorMessages.email ? (
                        <TinyText sx={{ color: 'red' }}>{errorMessages.email}</TinyText>
                      ) : (
                        <TinyText sx={{ color: 'green' }}>
                          Please provide a Email.
                        </TinyText>
                      )
                    }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errorMessages.password}
                  helperText={
                  errorMessages.password ? (
                        <TinyText sx={{ color: 'red' }}>{errorMessages.password}</TinyText>
                      ) : (
                        <TinyText sx={{ color: 'green' }}>
                          Please provide a password.
                        </TinyText>
                      )
                    }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errorMessages.confirmPassword}
                  helperText={
                    errorMessages.confirmPassword ? (
                        <TinyText sx={{ color: 'red' }}>{errorMessages.confirmPassword}</TinyText>
                      ) : (
                        <TinyText sx={{ color: 'green' }}>
                          Please provide a confirm Password.
                        </TinyText>
                      )
                    }
                />
              </Grid>
            </Grid>
            <Box sx={{
                marginTop: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}>
            </Box>
            <Grid item xs={12} sm={6} 
                sx={{ mt: 2, mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}
                >
              <Button
                type="submit"
                variant="outlined"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Grid>
          </Box>
        </Box>
      <DialogActions sx={{flexDirection: 'column', gap:2, my:2}}>
          <Button 
          variant="outlined"
          onClick={close} 
          color="success"
          endIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
