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
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack,
  CameraAlt,
  Event,
  CheckCircle,
  Cancel,
  Check,
  Help
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import { longFormatters } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const TournamentCreationPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdTournamentId, setCreatedTournamentId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    eventName: '',
    playerInfo: '',
    registrationStart: null,
    registrationEnd: null,
    tournamentStart: null,
    tournamentEnd: null,
    eligiblePlayers: 'Todos os jogadores',
    maxCategoriesPerPlayer: '',
    paymentMethod: 'Pix',
    registrationFeeType: 'Fixo',
    registrationFees: ['', '', '', ''],
    paymentDeadline: '1 dia',
    tournamentLocation: '',
    teamId: '',
    contactEmail: '',
    contactPhone: '',
    preRegistrationInfo: '',
    postRegistrationInfo: '',
    prizeDescription: '',
    prizeValue: '',
    tournamentRules: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleFeeChange = (index, value) => {
    const newFees = [...formData.registrationFees];
    newFees[index] = value;
    setFormData(prev => ({ ...prev, registrationFees: newFees }));
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
      // Format dates
      const formatDate = (date) => date ? format(date, 'yyyy-MM-dd') : null;

      // Prepare the request body
      const requestBody = {
        eventName: formData.eventName,
        playerInfo: formData.playerInfo,
        registrationStart: formatDate(formData.registrationStart),
        registrationEnd: formatDate(formData.registrationEnd),
        tournamentStart: formatDate(formData.tournamentStart),
        tournamentEnd: formatDate(formData.tournamentEnd),
        eligiblePlayers: formData.eligiblePlayers,
        maxCategoriesPerPlayer: parseInt(formData.maxCategoriesPerPlayer) || 0,
        paymentMethod: formData.paymentMethod,
        prizeValue: parseFloat(formData.prizeValue) || 0,
        registrationFeeType: formData.registrationFeeType,
        registrationFees: formData.registrationFees.map(fee => parseFloat(fee) || 0),
        paymentDeadline: formData.paymentDeadline,
        tournamentLocation: formData.tournamentLocation,
        teamId: parseInt(formData.teamId) || 0,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        preRegistrationInfo: formData.preRegistrationInfo,
        postRegistrationInfo: formData.postRegistrationInfo,
        prizeDescription: formData.prizeDescription,
        tournamentRules: formData.tournamentRules
      };

      // Simulate API call
      console.log('Submitting:', requestBody);
      
      // In a real app, you would make an actual API call here:
      /*
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create tournament');
      }
      */

      // Mock success response
      const mockResponse = { id: Math.floor(Math.random() * 1000) };
      setCreatedTournamentId(mockResponse.id);
      setSuccessModal(true);

      // Here you would also handle the image upload if an image was selected
      if (selectedImage) {
        // await uploadImage(mockResponse.id);
      }

    } catch (error) {
      console.error('Error creating tournament:', error);
      setErrorMessage(error.message);
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'cancelado': return 'error';
      case 'concluido': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativo': return <CheckCircle fontSize="small" />;
      case 'cancelado': return <Cancel fontSize="small" />;
      case 'concluido': return <Check fontSize="small" />;
      default: return <Help fontSize="small" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'cancelado': return 'Cancelado';
      case 'concluido': return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Criar Torneio
          </Typography>
        </Box>

        {/* Tournament Image */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Escolha uma imagem para seu torneio
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
          {/* Basic Info */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Informações Básicas
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <TextField
            fullWidth
            label="Nome do evento *"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Informações e observações aos jogadores"
            name="playerInfo"
            value={formData.playerInfo}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />

          {/* Dates Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Datas Importantes
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <DatePicker
              label="Início das inscrições *"
              value={formData.registrationStart}
              onChange={(date) => handleDateChange('registrationStart', date)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />

            <DatePicker
              label="Fim das inscrições *"
              value={formData.registrationEnd}
              onChange={(date) => handleDateChange('registrationEnd', date)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />

            <DatePicker
              label="Início dos jogos *"
              value={formData.tournamentStart}
              onChange={(date) => handleDateChange('tournamentStart', date)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />

            <DatePicker
              label="Fim dos jogos *"
              value={formData.tournamentEnd}
              onChange={(date) => handleDateChange('tournamentEnd', date)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />
          </Box>

          {/* Registration Rules */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Regras de Inscrição
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Quem pode se inscrever no torneio?</InputLabel>
            <Select
              value={formData.eligiblePlayers}
              onChange={handleChange}
              name="eligiblePlayers"
              label="Quem pode se inscrever no torneio?"
            >
              <MenuItem value="Todos os jogadores">Todos os jogadores</MenuItem>
              <MenuItem value="Somente membros">Somente membros</MenuItem>
              <MenuItem value="Por convite">Por convite</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Máximo de Categorias *"
            name="maxCategoriesPerPlayer"
            value={formData.maxCategoriesPerPlayer}
            onChange={handleChange}
            margin="normal"
            type="number"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Formas de pagamento</InputLabel>
            <Select
              value={formData.paymentMethod}
              onChange={handleChange}
              name="paymentMethod"
              label="Formas de pagamento"
            >
              <MenuItem value="Pix">Pix</MenuItem>
              <MenuItem value="Boleto">Boleto</MenuItem>
              <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="Fora da plataforma">Fora da plataforma</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Regras para valor de inscrição *</InputLabel>
            <Select
              value={formData.registrationFeeType}
              onChange={handleChange}
              name="registrationFeeType"
              label="Regras para valor de inscrição *"
            >
              <MenuItem value="Fixo">Fixo</MenuItem>
              <MenuItem value="Variável">Variável de acordo com o número da inscrição</MenuItem>
            </Select>
          </FormControl>

          {formData.registrationFeeType === 'Variável' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Valores de Inscrição
              </Typography>
              {[0, 1, 2, 3].map((index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`${index + 1}ª Inscrição`}
                  value={formData.registrationFees[index]}
                  onChange={(e) => handleFeeChange(index, e.target.value)}
                  margin="normal"
                  type="number"
                  InputProps={{ startAdornment: 'R$' }}
                />
              ))}
            </Box>
          )}

          {formData.registrationFeeType === 'Fixo' && (
            <TextField
              fullWidth
              label="Valor da inscrição"
              name="registrationFees"
              value={formData.registrationFees[0]}
              onChange={(e) => handleFeeChange(0, e.target.value)}
              margin="normal"
              type="number"
              InputProps={{ startAdornment: 'R$' }}
            />
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Prazo máximo para pagamento de inscrição</InputLabel>
            <Select
              value={formData.paymentDeadline}
              onChange={handleChange}
              name="paymentDeadline"
              label="Prazo máximo para pagamento de inscrição"
            >
              <MenuItem value="1 dia">1 dia</MenuItem>
              <MenuItem value="2 dias">2 dias</MenuItem>
              <MenuItem value="3 dias">3 dias</MenuItem>
              <MenuItem value="7 dias">7 dias</MenuItem>
              <MenuItem value="Não se aplica">Não se aplica</MenuItem>
            </Select>
          </FormControl>

          {/* Additional Info */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Mais informações sobre o evento
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <TextField
            fullWidth
            label="Local do Evento *"
            name="tournamentLocation"
            value={formData.tournamentLocation}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Team ID"
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            margin="normal"
            type="number"
          />

          <TextField
            fullWidth
            label="Email para contato *"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            margin="normal"
            type="email"
            required
          />

          <TextField
            fullWidth
            label="Telefone para contato *"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            margin="normal"
            type="tel"
            required
          />

          <TextField
            fullWidth
            label="Informações de pré registro"
            name="preRegistrationInfo"
            value={formData.preRegistrationInfo}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Informações de pós registro"
            name="postRegistrationInfo"
            value={formData.postRegistrationInfo}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Descrição de Premiação"
            name="prizeDescription"
            value={formData.prizeDescription}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Valor da Premiação"
            name="prizeValue"
            value={formData.prizeValue}
            onChange={handleChange}
            margin="normal"
            type="number"
            InputProps={{ startAdornment: 'R$' }}
          />

          <TextField
            fullWidth
            label="Regras do torneio"
            name="tournamentRules"
            value={formData.tournamentRules}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />

          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ px: 6, py: 1.5, borderRadius: '30px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Finalizar inscrição'}
            </Button>
          </Box>
        </Box>

        {/* Success Modal */}
        <Dialog open={successModal} onClose={() => setSuccessModal(false)}>
          <DialogContent>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Torneio criado com sucesso!
              </Typography>
              <Typography>
                Seu torneio foi criado e está pronto para receber inscrições.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="contained"
              onClick={() => {
                setSuccessModal(false);
                navigate(`/tournament/${createdTournamentId}`);
              }}
            >
              Ver Torneio
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Modal */}
        <Dialog open={errorModal} onClose={() => setErrorModal(false)}>
          <DialogContent>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Cancel color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Erro ao criar torneio
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
    </LocalizationProvider>
  );
};

export default TournamentCreationPage;