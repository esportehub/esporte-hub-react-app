import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Por favor, insira seu email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/auth/forgot-password', {
        email: email
      });

      if (response.status === 200) {
        toast.success('Email de recuperação enviado com sucesso!');
        navigate('/login'); // Redirect to login page
      } else {
        toast.error('Erro ao enviar email de recuperação');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Esqueci minha senha
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="sm" 
        sx={{ 
          pt: 4,
          pb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Back button for desktop */}
        {!isMobile && (
          <Box 
            sx={{ 
              width: '100%',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBack sx={{ mr: 1 }} />
            <Typography variant="body1">Voltar</Typography>
          </Box>
        )}

        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 2,
            alignSelf: 'flex-start',
            fontWeight: 600
          }}
        >
          Esqueceu sua senha?
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            alignSelf: 'flex-start',
            color: theme.palette.text.secondary
          }}
        >
          Não se preocupe! Iremos lhe enviar um e-mail com um link para redefinir sua senha, digite o e-mail associado à sua conta abaixo.
        </Typography>

        <TextField
          fullWidth
          label="Seu endereço de email cadastrado"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            style: {
              borderRadius: '12px',
              backgroundColor: theme.palette.background.paper,
            }
          }}
          InputLabelProps={{
            style: {
              color: theme.palette.text.secondary,
            }
          }}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            width: isMobile ? '100%' : 270,
            height: 50,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </Button>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;