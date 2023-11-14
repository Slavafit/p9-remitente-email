import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import logo from "../assets/donbosco_logo.png";
import axios from 'axios';
import { useAuth } from './AuthContext';


function ResetPasswordPage () {
  const [password, setPassword] = useState('');
  const { userId, token } = useParams();
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const { showSnack } = useAuth();

  const handleNewPass = (event) => {
    const password = event.target.value;
    if (password.length < 6 || password.length > 20) {
      setError("La contraseña debe tener entre 6 y 20 caracteres.");
      setIsFormValid(false);
    } else {
      setError("");
      setIsFormValid(password === confirmPass);
    }
    setPassword(password);
  };

  const handleConfirmPass = (event) => {
    const confirmPassword = event.target.value;
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsFormValid(false);
    } else {
      setError("");
      setIsFormValid(password.length >= 6 && password.length <= 20);
    }
    setConfirmPass(confirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    const form = event.currentTarget;
      try {
        const response = await axios.post(`https://p9-remitente.oa.r.appspot.com/resetpassword/reset/${userId}/${token}`, { password });
        
        console.log(response.data.message);
        showSnack('success', response.data.message);
        navigate('/');
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
    form.reset();
  };


  return (
    <>
    <Grid container component="main" sx={{ 
      bgcolor: 'grey.300', 
      display: "flex", 
      alignItems: "center", 
      flexDirection: "column",
      height: '100vh',
      }}>
      <CssBaseline />
              <Box component="form" onSubmit={handleSubmit} 
                sx={{
                  padding: 3,
                  borderRadius: 5,
                  mt: 5,
                  width: 300,
                  gap:2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "Menu",
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
                }}
              >
              <Avatar alt="logo Don Bosco" src={logo}/>
              <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                Nueva contraseña
              </Typography>
            <TextField
              sx={{ margin: 1 }}
              fullWidth
              label="Nueva contraseña" 
              type='password'
              value={password}
              onChange={handleNewPass}
              error={error.length > 0}
              helperText={error}
            />
            <TextField
              sx={{ margin: 1 }}
              fullWidth
              type='password'
              label="Confirmar contraseña" 
              value={confirmPass}
              onChange={handleConfirmPass}
              error={error.length > 0}
              helperText={error}
            />
            <Button 
              type="submit" 
              variant='outlined' 
              color='success' 
              disabled={!isFormValid}
              sx={{mt:2}}
              >
                Enviar
              </Button>
          </Box>
    </Grid>
    </>
  );
}

export default ResetPasswordPage;