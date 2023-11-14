import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import logo from "../assets/donbosco_logo.png";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useAuth } from '../service/AuthContext'
import ForgotPassword from '../service/ForgotPassword';
import axios from 'axios';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


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
    const [resetOpen, setResetOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const { showSnack } = useAuth();

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
        const passPattern = /^[a-zA-Z0-9.-]{6,20}$/;
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


    // Функция для аутентификации пользователя
  const authUser = async (email, password) => {
    try {
      // Проверить, есть ли токен в sessionStorage
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        // Если токен уже есть в localStorage, используйте его для аутентификации
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        return true;
        } else {
        // Отправить запрос на сервер с именем пользователя и паролем
        const response = await axios.post('https://p9-remitente.oa.r.appspot.com/login', {
          email,
          password,
        });
        console.log("response",response);
        // Получить JWT-токен и прочее из ответа сервера
        const token = response.data.token;
        const userId = response.data.userData.userId;
        const username = response.data.userData.username;
        const userRole = response.data.userData.role;
        // Сохранить токен и остальное в sessionStorage или в памяти приложения
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userRole', userRole);
        sessionStorage.setItem('userRole', userRole);
        // Вернуть успех
        return true;
      }
    } catch (error) {
      // Вернуть ошибку аутентификации
      const response = error.response.data.message
      console.log("Error authUser", response);
      showSnack('warning', response);
      return false;
    }
  };
    //обработчик отображения пароля
    const handlePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  return (
    <>
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
                Acceso
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {isEmailValid ? (
                  <TinyText sx={{ color: 'green' }}>
                    Email es válida.
                  </TinyText>
                ) : (
                  <TinyText sx={{ color: 'red' }}>
                    Por favor, introduce email válida.
                  </TinyText>
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handlePasswordVisibility}
                        edge="end"
                        title="monstrar la conrtaseña"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
                  {isPassValid ? (
                  <TinyText sx={{ color: 'green' }}>
                    La contraseña es válida.
                  </TinyText>
                ) : (
                  <TinyText sx={{ color: 'red' }}>
                    mínimo 6 y máximo 20 caracteres.
                  </TinyText>
                )}
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Acuérdate de mí"
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
                  Iniciar sesión
                </Button>
                <Link
                  sx={{ 
                    variant: 'body2',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    color: "black",
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                  onClick={()=>{setResetOpen(true)}}
                >
                  ¿Has olvidado tu contraseña?
                </Link>
              </Box>
            </Box>
            <Typography sx={{
                marginTop: 0,
                textAlign: "center",
                opacity: 0.8
              }}>©{' '}{new Date().getFullYear()}
                {' '}
                Fundación Don Bosco
                {'  '}
                Salesianos Social
              </Typography> 
            </Widget>
          </Container>
        </WallPaper>
    </Grid>
    <ForgotPassword
      open={resetOpen}
      close={()=>{setResetOpen(false)}}
    />
    </>
  );
}