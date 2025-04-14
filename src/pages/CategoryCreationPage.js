import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { ArrowBack, CameraAlt } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryCreationPage = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    disputeModel: '',
    maxRegistrations: '',
    gameType: '',
    sets: '',
    games: '',
    gender: '',
    level: '',
    minAge: '1',
    maxAge: '99'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // You would typically compress the image here
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare the request body
      const requestBody = {
        tournament_id: tournamentId,
        name: formData.name,
        dispute_model: formData.disputeModel,
        max_registrations: parseInt(formData.maxRegistrations) || 0,
        game_type: formData.gameType,
        sets: parseInt(formData.sets) || 0,
        games: parseInt(formData.games) || 0,
        gender: formData.gender,
        category: formData.level,
        min_age: parseInt(formData.minAge) || 0,
        max_age: parseInt(formData.maxAge) || 0
      };

      // Simulate API call
      console.log('Submitting:', requestBody);
      
      // In a real app, you would make an actual API call here:
      /*
      const response = await fetch(`${process.env.REACT_APP_API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create category');
      }
      */

      // Mock success response
      setSuccessModal(true);

      // Here you would also handle the image upload if an image was selected
      if (selectedImage) {
        // await uploadImage(data.id);
      }

    } catch (error) {
      console.error('Error creating category:', error);
      setErrorMessage(error.message);
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Cadastrar Categoria
        </Typography>
      </Box>

      {/* Category Image */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Escolha uma imagem para sua categoria
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={selectedImage}
            variant="rounded"
            sx={{ width: 120, height: 120 }}
          >
            {!selectedImage && <CameraAlt fontSize="large" />}
          </Avatar>
          <Button
            variant="contained"
            component="label"
            startIcon={<CameraAlt />}
          >
            Upload Imagem
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </Box>
        {selectedImage && (
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Imagem selecionada
          </Typography>
        )}
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Typography variant="h5" gutterBottom>
          Informações da Categoria
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          label="Nome da Categoria *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Máximo de Registros *"
          name="maxRegistrations"
          value={formData.maxRegistrations}
          onChange={handleChange}
          margin="normal"
          type="number"
          required
        />

        {/* Dispute Model */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Modalidade</InputLabel>
          <Select
            name="disputeModel"
            value={formData.disputeModel}
            onChange={handleChange}
            label="Modalidade"
          >
            <MenuItem value="Eliminatório">Eliminatório</MenuItem>
            <MenuItem value="Todos contra todos">Todos contra todos</MenuItem>
          </Select>
        </FormControl>

        {/* Game Type */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Estilo de Jogo</InputLabel>
          <Select
            name="gameType"
            value={formData.gameType}
            onChange={handleChange}
            label="Estilo de Jogo"
          >
            <MenuItem value="Simples">Simples</MenuItem>
            <MenuItem value="Duplas">Duplas</MenuItem>
          </Select>
        </FormControl>

        {/* Sets */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Quantidade de Sets</InputLabel>
          <Select
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            label="Quantidade de Sets"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <MenuItem key={num} value={num.toString()}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Games */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Quantidade de Games</InputLabel>
          <Select
            name="games"
            value={formData.games}
            onChange={handleChange}
            label="Quantidade de Games"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <MenuItem key={num} value={num.toString()}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Gender */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Gênero da Categoria</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Gênero da Categoria"
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Feminino">Feminino</MenuItem>
            <MenuItem value="Mista">Mista</MenuItem>
          </Select>
        </FormControl>

        {/* Level */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Nível da Categoria</InputLabel>
          <Select
            name="level"
            value={formData.level}
            onChange={handleChange}
            label="Nível da Categoria"
          >
            {['A', 'B', 'C', 'D'].map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Age Restrictions */}
        <Typography variant="h6" gutterBottom>
          Restrições de Idade
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Idade Mínima"
            name="minAge"
            value={formData.minAge}
            onChange={handleChange}
            margin="normal"
            type="number"
          />

          <TextField
            fullWidth
            label="Idade Máxima"
            name="maxAge"
            value={formData.maxAge}
            onChange={handleChange}
            margin="normal"
            type="number"
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ px: 6, py: 1.5, borderRadius: '30px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Finalizar Cadastro'}
          </Button>
        </Box>
      </Box>

      {/* Success Modal */}
      <Dialog open={successModal} onClose={() => setSuccessModal(false)}>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Categoria criada com sucesso!
            </Typography>
            <Typography>
              Sua categoria foi criada e está pronta para receber inscrições.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={() => {
              setSuccessModal(false);
              navigate(`/tournament/${tournamentId}`);
            }}
          >
            Voltar para o Torneio
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={errorModal} onClose={() => setErrorModal(false)}>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Erro ao criar categoria
            </Typography>
            <Typography>{errorMessage}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setErrorModal(false)}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryCreationPage;