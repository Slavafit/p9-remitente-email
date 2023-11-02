import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import logo from "../assets/donbosco_logo.png";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { authUser } from '../Service/AuthUser';
import { useAuth } from '../Service/AuthContext'


const WallPaper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(https://source.unsplash.com/random?wallpapers)`,
  backgroundRepeat: 'no-repeat',
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));
const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 15,
  width: 400,
  maxWidth: '100%',
  margin: 'auto',
  marginTop: 30,
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
}));
const TinyText = styled(Typography)({
    fontSize: '1rem',
    opacity: 0.6,
    fontWeight: 500,
    letterSpacing: 0.3,
    marginTop: 6,
    fontFamily: 'monospace',
    display: 'flex'
  });

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPassValid, setIsPassValid] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        // есть ли сохраненные данные в localStorage
        const storedEmail = localStorage.getItem('email');
        const storedPassword = localStorage.getItem('password');
    
        if (storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setRememberMe(true);
        }
        }, []);

    // Эффект для отслеживания изменений в поле email
    useEffect(() => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setIsEmailValid(emailPattern.test(email));
    }, [email]);

    // Эффект для отслеживания изменений в поле пароль
    useEffect(() => {
        const passPattern = /^[a-zA-Z0-9.-]{4,20}$/;
        setIsPassValid(passPattern.test(password));
    }, [password]);


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const auth = await authUser(email, password);
          
          if (auth) {
            // Сохраняем данные пользователя, если "Remember Me" отмечено
            if (rememberMe) {
              localStorage.setItem('email', email);
              localStorage.setItem('password', password);
            } else {
              // Если "Remember Me" не отмечено, удаляем данные из localStorage
              localStorage.removeItem('email');
              localStorage.removeItem('password');
            }
            login();
            // В случае успешной аутентификации, перенаправьте пользователя
            navigate('/home'); // Замените на нужный URL
    
          } else {
            // Обработайте ошибку, например, выведите сообщение об ошибке на странице
            console.log("not Authenticated");
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      };

  return (
    <Grid theme={theme} container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
        <WallPaper >
          <Container>
            <Widget>
            <Box
              sx={{
                my: 4,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar alt="logo Don Bosco" src={logo}/>
              <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                Log in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {isEmailValid ? (
                  <TinyText sx={{ color: 'green' }}>
                    Email address is valid.
                  </TinyText>
                ) : (
                  <TinyText sx={{ color: 'red' }}>
                    Please, enter a valid email address.
                  </TinyText>
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                  {isPassValid ? (
                  <TinyText sx={{ color: 'green' }}>
                    Password is valid.
                  </TinyText>
                ) : (
                  <TinyText sx={{ color: 'red' }}>
                    minimum 4 and maximum 20 characters.
                  </TinyText>
                )}
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  endIcon={<VpnKeyIcon />}
                  disabled={!isEmailValid || !isPassValid ||!email || !password}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
            <Typography sx={{
                marginTop: 0,
                textAlign: "center",
                opacity: 0.8
              }}>Fundacion Don Bosco © 
                {' '}
                {new Date().getFullYear()}
                {'.'}
              </Typography> 
            </Widget>
          </Container>
        </WallPaper>
    </Grid>
  );
}