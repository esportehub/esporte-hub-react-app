import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Stack,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format, parse } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ptBR } from 'date-fns/locale';

const DadosPessoais = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    middleName: '',
    document: '',
    email: '',
    phone: '',
    birthday: null,
    about: '',
    gender: ''
  });
  const [genderOptions] = useState(['Feminino', 'Masculino']);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setFormData({
            name: userData.name || '',
            middleName: userData.middleName || '',
            document: userData.document || '',
            email: userData.email || '',
            phone: userData.phone || '',
            birthday: userData.birthday ? parse(userData.birthday, 'yyyy-MM-dd', new Date()) : null,
            about: userData.about || '',
            gender: userData.gender || ''
          });
        } else {
          throw new Error('Failed to load user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      birthday: date
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const formattedDate = formData.birthday ? format(formData.birthday, 'yyyy-MM-dd') : null;
      
      const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/users/${user.id}/update-user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          about: formData.about,
          document: formData.document,
          birthday: formattedDate
        })
      });

      if (response.ok) {
        toast.success('Informações atualizadas com sucesso!');
        navigate('/profile');
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('Erro ao atualizar dados do usuário');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Erro ao carregar dados do usuário</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: 'background.paper' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ color: 'text.primary' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              Meus dados pessoais
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ flex: 1, py: 3 }}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Typography variant="body1" fontWeight="bold">Nome</Typography>
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: !!formData.name
                  }}
                  sx={{
                    backgroundColor: formData.name ? 'action.disabledBackground' : 'background.paper'
                  }}
                />

                <Typography variant="body1" fontWeight="bold">Sobrenome</Typography>
                <TextField
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: !!formData.middleName
                  }}
                  sx={{
                    backgroundColor: formData.middleName ? 'action.disabledBackground' : 'background.paper'
                  }}
                />

                <Typography variant="body1" fontWeight="bold">Email</Typography>
                <TextField
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    backgroundColor: formData.email ? 'action.disabledBackground' : 'background.paper'
                  }}
                />

                <Typography variant="body1" fontWeight="bold">Documento CPF</Typography>
                <TextField
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: !!formData.document
                  }}
                  sx={{
                    backgroundColor: formData.document ? 'action.disabledBackground' : 'background.paper'
                  }}
                />

                <Typography variant="body1" fontWeight="bold">Telefone WhatsApp</Typography>
                <TextField
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  type="tel"
                  sx={{
                    backgroundColor: formData.phone ? 'action.disabledBackground' : 'background.paper'
                  }}
                />

                <Typography variant="body1" fontWeight="bold">Data de Nascimento</Typography>
                <DatePicker
                  value={formData.birthday}
                  onChange={handleDateChange}
                  disabled={!!formData.birthday}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      sx={{
                        backgroundColor: formData.birthday ? 'action.disabledBackground' : 'background.paper'
                      }}
                    />
                  )}
                />

                <Typography variant="body1" fontWeight="bold">Sobre você, {user.name}</Typography>
                <TextField
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  placeholder="Esportes que pratica, seus pontos fortes, disponibilidade, etc."
                  sx={{
                    backgroundColor: formData.about ? 'action.disabledBackground' : 'background.paper'
                  }}
                />

                <Typography variant="body1" fontWeight="bold">Gênero</Typography>
                {user.gender ? (
                  <Chip
                    label={user.gender}
                    sx={{
                      backgroundColor: 'secondary.light',
                      color: 'text.primary',
                      alignSelf: 'flex-start'
                    }}
                  />
                ) : (
                  <Stack direction="row" spacing={2}>
                    {genderOptions.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        onClick={() => handleGenderChange(option)}
                        sx={{
                          backgroundColor: formData.gender === option ? 'secondary.light' : 'background.paper',
                          color: formData.gender === option ? 'text.primary' : 'text.secondary',
                          border: formData.gender === option ? '2px solid' : '2px solid',
                          borderColor: formData.gender === option ? 'secondary.main' : 'divider'
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  Atualizar dados
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default DadosPessoais;