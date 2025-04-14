import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Box,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

const TournamentRegistrationPage = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [tournament, setTournament] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [shirtSize, setShirtSize] = useState('M');
  const [gender, setGender] = useState('');

  /*useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        const tournamentResponse = await axios.get(
          `/beach-tennis/tournaments/${tournamentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        
        setUser(userResponse.data);
        setTournament(tournamentResponse.data);
        
        setFormData({
          name: `${userResponse.data.name} ${userResponse.data.middleName || ''}`.trim(),
          email: userResponse.data.email || '',
          document: userResponse.data.document || '',
          phone: userResponse.data.phone || '',
        });
        
        setGender(userResponse.data.gender || '');
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tournamentId]);
  */

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.document) {
      newErrors.document = 'CPF é obrigatório';
    } else if (!cpfValidator.isValid(formData.document)) {
      newErrors.document = 'CPF inválido';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length !== 11) {
      newErrors.phone = 'Telefone deve ter 11 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const formatCPF = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setFormData(prev => ({ ...prev, phone: cleaned }));
    }
  };

  const handleCPFChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setFormData(prev => ({ ...prev, document: cleaned }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const needsUpdate = !user.document || !user.phone || !user.gender;
      
      if (needsUpdate) {
        await axios.patch(
          `/users/${user.id}/update-documents`,
          {
            document: formData.document,
            phone: formData.phone,
            gender: gender
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
      }
      
      navigate(`/tournament/${tournamentId}/categories`, {
        state: {
          shirtSize,
          userGender: gender,
          user: {
            ...user,
            document: formData.document,
            phone: formData.phone,
            gender
          }
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  /*if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          Error: {error}
        </Alert>
      </Snackbar>
    );
  }
    */

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ backgroundColor: theme.palette.background.paper }}
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
            Inscrição de torneio
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Preencha e verifique os campos corretamente para inscrever-se neste torneio.
        </Typography>
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          Formulário de inscrição
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <TextField
            fullWidth
            label="Nome do Atleta"
            margin="normal"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              readOnly: true
            }}
          />

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              readOnly: true
            }}
          />

          {/* CPF Field */}
          <TextField
            fullWidth
            label="Número do CPF"
            margin="normal"
            variant="outlined"
            name="document"
            value={formatCPF(formData.document)}
            onChange={handleCPFChange}
            error={!!errors.document}
            helperText={errors.document}
            InputProps={{
              readOnly: false
            }}
          />

          {/* Phone Field */}
          <TextField
            fullWidth
            label="Telefone"
            margin="normal"
            variant="outlined"
            name="phone"
            value={formatPhone(formData.phone)}
            onChange={handlePhoneChange}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              readOnly: false
            }}
          />

          {/* Gender Field */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Gênero</InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="Gênero"
              error={!gender}
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Feminino">Feminino</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 3 }} />

          {/* Shirt Size Field */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Tamanho da Camiseta</InputLabel>
            <Select
              value={shirtSize}
              onChange={(e) => setShirtSize(e.target.value)}
              label="Tamanho da Camiseta"
            >
              <MenuItem value="PP">PP</MenuItem>
              <MenuItem value="P">P</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="G">G</MenuItem>
              <MenuItem value="GG">GG</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TournamentRegistrationPage;