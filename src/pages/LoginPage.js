import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  IconButton, 
  InputAdornment, 
  Container,
  Grid,
  Link,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import logo from "../assets/images/esporte-hub-logo.png"
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API call
      const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setSnackbarMessage('Autenticado com sucesso!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        navigate('/home');
      } else {
        setError(data.message || 'Falha ao autenticar');
        setSnackbarMessage(`Falha ao autenticar! \n${data.message}`);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (err) {
      setError('Ocorreu um erro durante o login');
      setSnackbarMessage('Ocorreu um erro durante o login');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            mb: 3
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              py: 4,
              px: 3,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: 120,
                maxWidth: '100%',
                borderRadius: '10px'
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Bora pro jogo?
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Faça login para continuar
          </Typography>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Senha"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            sx={{ mb: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              sx={{ 
                textDecoration: 'none',
                color: 'primary.main',
                fontSize: '0.875rem'
              }}
            >
              Esqueci minha senha
            </Link>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
            disabled={isLoading}
            sx={{ 
              py: 1.5,
              mb: 3,
              borderRadius: 1
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>

          <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
            Ou entre com sua rede social:
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <IconButton 
              sx={{ 
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <GoogleIcon color="error" />
            </IconButton>
            <IconButton 
              sx={{ 
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <FacebookIcon color="primary" />
            </IconButton>
            <IconButton 
              sx={{ 
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <TwitterIcon color="info" />
            </IconButton>
            <IconButton 
              sx={{ 
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <InstagramIcon color="secondary" />
            </IconButton>
          </Box>

          <Typography variant="body1" align="center" sx={{ color: 'text.primary' }}>
            Ainda não tem cadastro?{' '}
            <Link 
              component={RouterLink} 
              to="/register" 
              sx={{ 
                textDecoration: 'none',
                color: 'primary.main'
              }}
            >
              Cadastrar
            </Link>
          </Typography>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;