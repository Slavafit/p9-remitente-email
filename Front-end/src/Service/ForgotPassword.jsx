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
import { useAuth } from './Context';


const TinyText = styled(Typography)({
  fontSize: '0.9rem',
  opacity: 0.7,
  fontWeight: 500,
  letterSpacing: 0.2,
  marginTop: 4,
  fontFamily: 'monospace',
  display: 'flex'
});

export default function ForgotPassword( { open, close } ) {
  const { showSnack } = useAuth();
  const [formData, setFormData] = useState({
    password: ""
  });

  const [errorMessages, setErrorMessages] = useState({
    email: ""
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
  
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrorMessages.email = "Por favor proporcione una dirección de correo electrónico.";
      hasErrors = true;
    }
    setErrorMessages(newErrorMessages); // Обновляем сообщения об ошибках
    

    if (!hasErrors) {
      try {
        const response = await axios.post(
          "https://p9-remitente.oa.r.appspot.com/resetpassword/forgot", formData);
        let responseMessage = response.data.message;
        console.log(responseMessage);
        close();
        showSnack('success', responseMessage);
        // Очистка формы и других состояний
        setFormData({
          email: ""
        });
  

      } catch (error) {
        if (error.response.data.message) {
          console.error("Server error:", error.response);
          let responseError = error.response.data.error;
          let responseMessage = error.response.data.message;
          showSnack('Atención:', responseMessage);
        } else {
          console.error("Error sending data:", error);
          const resMessage = error.response.data.errors[0];
          showSnack('Atención:', resMessage.message);
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
            Restablecer la contraseña
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2}}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  type="email"
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
