import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { ArrowBack, Report, SportsSoccer, EmojiEvents, Groups, Schedule, Rule } from '@mui/icons-material';

const TournamentGroupsPage = () => {
  const { tournamentId, categoryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [matches, setMatches] = useState([]);
  const [categoryRegistrations, setCategoryRegistrations] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [problemType, setProblemType] = useState('');
  const [problemMessage, setProblemMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkUserRole();
        await Promise.all([
          fetchGroups(),
          fetchMatches(),
          fetchCategoryRegistrations()
        ]);
      } catch (error) {
        toast.error('Error loading data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId, categoryId]);

  const checkUserRole = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/user_role`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.roles.includes('admin'));
      } else {
        throw new Error('Failed to load user role');
      }
    } catch (error) {
      toast.error('Error fetching user role: ' + error.message);
    }
  };

  const fetchGroups = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/tournaments/${tournamentId}/categories/${categoryId}/groups`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setGroups(data);
    } else {
      throw new Error('Failed to load groups');
    }
  };

  const fetchMatches = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/tournaments/${tournamentId}/categories/${categoryId}/matches`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setMatches(data);
    } else {
      throw new Error('Failed to load matches');
    }
  };

  const fetchCategoryRegistrations = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/category-registrations/${categoryId}/${tournamentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCategoryRegistrations(data);
    } else {
      throw new Error('Failed to load category registrations');
    }
  };

  const getPlayerById = (playerId) => {
    for (const registration of categoryRegistrations) {
      if (registration.player1?.id === playerId) return registration.player1;
      if (registration.player2?.id === playerId) return registration.player2;
    }
    return null;
  };

  const getRegistrationById = (registrationId) => {
    return categoryRegistrations.find(reg => reg.id === registrationId);
  };

  const handleSubmitProblemReport = () => {
    if (problemType && problemMessage) {
      // Here you would typically send the report to your backend
      console.log('Problem Type:', problemType);
      console.log('Problem Message:', problemMessage);
      toast.success('Problem reported successfully!');
      setProblemDialogOpen(false);
      setProblemType('');
      setProblemMessage('');
    } else {
      toast.warning('Please select a problem type and enter a message');
    }
  };

  const buildGroupWidget = (group) => {
    const groupMatches = matches.filter(match => match.groupId === group.id);
    
    return (
      <Card key={group.id} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Grupo {group.groupNumber}
          </Typography>
          
          {groupMatches.map((match, index) => (
            <Box key={match.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Partida {index + 1}</Typography>
              {buildMatchWidget(match)}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const buildMatchWidget = (match) => {
    const registration1 = getRegistrationById(match.categoryRegistrationId1);
    const registration2 = getRegistrationById(match.categoryRegistrationId2);
    
    const player1 = registration1?.player1;
    const player2 = registration1?.player2;
    const player3 = registration2?.player1;
    const player4 = registration2?.player2;

    return (
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-around" alignItems="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar src={player1?.imageUrl} sx={{ width: 48, height: 48 }} />
            <Typography variant="caption" textAlign="center">
              {player1?.name || 'Desconhecido'}
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar src={player2?.imageUrl} sx={{ width: 48, height: 48 }} />
            <Typography variant="caption" textAlign="center">
              {player2?.name || 'Desconhecido'}
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ mx: 2 }}>VS</Typography>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar src={player3?.imageUrl} sx={{ width: 48, height: 48 }} />
            <Typography variant="caption" textAlign="center">
              {player3?.name || 'Desconhecido'}
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar src={player4?.imageUrl} sx={{ width: 48, height: 48 }} />
            <Typography variant="caption" textAlign="center">
              {player4?.name || 'Desconhecido'}
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  };

  const navButtons = [
    { label: 'Torneio', icon: <SportsSoccer />, action: () => navigate(`/tournament/${tournamentId}`) },
    { label: 'Classificação', icon: <EmojiEvents />, action: () => {} },
    { label: 'Jogos grupos', icon: <Groups />, action: () => {} },
    { label: 'Jogos finais', icon: <Schedule />, action: () => navigate(`/tournament/${tournamentId}/bracket`) },
    { label: 'Regras', icon: <Rule />, action: () => {} },
    { label: 'Relatar Problema', icon: <Report />, action: () => setProblemDialogOpen(true) },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Grupos da categoria
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto' }}>
          {navButtons.map((button, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={button.icon}
              onClick={button.action}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {button.label}
            </Button>
          ))}
        </Box>

        {groups.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6">Grupos ainda não sorteados!</Typography>
          </Box>
        ) : (
          groups.map(group => buildGroupWidget(group))
        )}
      </Box>

      {/* Problem Report Dialog */}
      <Dialog open={problemDialogOpen} onClose={() => setProblemDialogOpen(false)}>
        <DialogTitle>Relatar Problema</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipo do problema</InputLabel>
            <Select
              value={problemType}
              label="Tipo do problema"
              onChange={(e) => setProblemType(e.target.value)}
            >
              <MenuItem value="Torneio">Torneio</MenuItem>
              <MenuItem value="Aplicativo">Aplicativo</MenuItem>
              <MenuItem value="Grupos">Grupos</MenuItem>
              <MenuItem value="Sugestão">Sugestão</MenuItem>
              <MenuItem value="Outro">Outro</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Descreva o problema"
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
            value={problemMessage}
            onChange={(e) => setProblemMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProblemDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmitProblemReport} color="primary">Enviar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TournamentGroupsPage;