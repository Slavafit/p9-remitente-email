import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { styled } from '@mui/material/styles';
import { addTokenToHeaders } from "./addTokenToHeaders";


const TinyText = styled(Typography)({
  fontSize: '0.9rem',
  opacity: 0.7,
  fontWeight: 500,
  letterSpacing: 0.2,
  marginTop: 4,
  fontFamily: 'monospace',
  display: 'flex'
});

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
      newErrorMessages.username = "Por favor, proporcione un nombre de usuario.";
      hasErrors = true;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrorMessages.email = "Por favor proporcione una dirección de correo electrónico.";
      hasErrors = true;
    }
  
    if (formData.password.trim() === "") {
      newErrorMessages.password = "Por favor proporcione una contraseña.";
      hasErrors = true;
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrorMessages.confirmPassword = "Las contraseñas no coinciden.";
      hasErrors = true;
    }
    setErrorMessages(newErrorMessages); // Обновляем сообщения об ошибках
    

    if (!hasErrors) {
      try {
        addTokenToHeaders();
        const response = await axios.post(
          "http://localhost:5000/registration", formData);
        let responseMessage = response.data.message;
        showSnack('success', responseMessage);
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
          showSnack('warning', responseMessage);
        } else {
          console.error("Error sending data:", error);
          const resMessage = error.response.data.errors[0];
          showSnack('warning', resMessage.message);
        }
      }
    }
  
    form.reset();
  };
  


  return (
    <Dialog open={open} onClose={close}>
      <DialogContent sx={{padding: 3, bgcolor: 'grey.300'}}>
        <Box
          sx={{
            mt: 0,
            padding: 3,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: "Menu",
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Typography component="h1" variant="h5">
            Añadir nuevo usuario
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  autoComplete
                  name="username"
                  label="Nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errorMessages.username}
                  helperText={
                  errorMessages.username ? (
                      <TinyText sx={{ color: 'red' }}>{errorMessages.username}</TinyText>
                    ) : (
                      <TinyText sx={{ color: 'green' }}>
                        Por favor proporcione un nombre de usuario.
                      </TinyText>
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Correo electrónico"
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
                          Por favor proporcione un correo electrónico.
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
                  label="Contraseña"
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
                          Por favor proporcione una contraseña.
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
                  label="Confirmar Contraseña"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errorMessages.confirmPassword}
                  helperText={
                    errorMessages.confirmPassword ? (
                        <TinyText sx={{ color: 'red' }}>{errorMessages.confirmPassword}</TinyText>
                      ) : (
                        <TinyText sx={{ color: 'green' }}>
                          Por favor proporcione una contraseña confirmada.
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
                Enviar
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
            Cancelar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
