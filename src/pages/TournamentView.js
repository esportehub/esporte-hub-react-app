import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tab,
  Tabs,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Pagination
} from '@mui/material';
import { ArrowBack, Add, Search, FilterList, CheckCircle, Cancel, Check } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';

const TournamentView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [createdTournaments, setCreatedTournaments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    ativos: false,
    concluidos: false,
    cancelados: false
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
        await fetchTournaments();
        await checkUserRole();
      } catch (error) {
        toast.error('Error loading data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTournamentsRegistrations(user.id);
    }
  }, [user]);

  const fetchUser = async () => {
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
      return userData;
    } else {
      throw new Error('Failed to load user info');
    }
  };

  const fetchTournament = async (tournamentId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/tournaments/${tournamentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to load tournament');
    }
  };

  const fetchTournamentsRegistrations = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/tournament-registrations/tournaments/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const tournaments = [];

        for (const registration of data) {
          const tournamentId = registration.tournament_id;
          const tournament = await fetchTournament(tournamentId);
          tournaments.push(tournament);
        }

        setMyTournaments(tournaments);
        setTotalPages(Math.ceil(tournaments.length / 5));
      } else {
        throw new Error('Failed to load tournament registrations');
      }
    } catch (error) {
      toast.error('Error fetching tournament registrations: ' + error.message);
    }
  };

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/tournaments`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
        setTotalPages(Math.ceil(data.length / 5));

        if (user) {
          const created = data.filter(t => t.ownerId === user.id);
          setCreatedTournaments(created);
        }
      } else {
        throw new Error('Failed to load tournaments');
      }
    } catch (error) {
      toast.error('Error fetching tournaments: ' + error.message);
    }
  };

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

  const filterTournaments = (tournaments) => {
    return tournaments.filter(tournament => {
      const matchesSearchQuery = tournament.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatusFilter = 
        (filters.ativos && tournament.status === 'ativo') ||
        (filters.concluidos && tournament.status === 'concluido') ||
        (filters.cancelados && tournament.status === 'cancelado') ||
        (!isFilterApplied);
      
      return matchesSearchQuery && matchesStatusFilter;
    });
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
      default: return null;
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  };

  const handleFilterApply = () => {
    const anyFilterApplied = filters.ativos || filters.concluidos || filters.cancelados;
    setIsFilterApplied(anyFilterApplied);
    setCurrentPage(1);
    setFilterDialogOpen(false);
    toast.success('Filtros aplicados!');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const buildTournamentCard = (tournament) => {
    return (
      <Card 
        key={tournament.id} 
        sx={{ mb: 2, cursor: 'pointer' }}
        onClick={() => navigate(`/tournament/${tournament.id}`)}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="/logo.png" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{tournament.eventName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Inscrições: {format(new Date(tournament.registrationStart), 'dd/MM/yyyy')} - {format(new Date(tournament.registrationEnd), 'dd/MM/yyyy')}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(tournament.status)}
              label={getStatusText(tournament.status)}
              color={getStatusColor(tournament.status)}
              variant="outlined"
              size="small"
            />
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const renderTournamentList = (tournamentList) => {
    const filteredTournaments = filterTournaments(tournamentList);
    const pageCount = Math.ceil(filteredTournaments.length / 5);
    const currentItems = filteredTournaments.slice(
      (currentPage - 1) * 5,
      currentPage * 5
    );

    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder={`Pesquisar ${tabValue === 0 ? 'todos torneios' : tabValue === 1 ? 'meus torneios' : 'torneios criados'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
          <Button
            variant="contained"
            color={isFilterApplied ? "secondary" : "inherit"}
            startIcon={<FilterList />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filtrar
          </Button>
        </Box>

        {currentItems.length === 0 ? (
          <Typography color="error" textAlign="center" my={2}>
            Torneios não encontrados neste filtro
          </Typography>
        ) : (
          <Box>
            {currentItems.map(tournament => buildTournamentCard(tournament))}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Torneios
          </Typography>
          {isAdmin && (
            <IconButton
              color="inherit"
              onClick={() => navigate('/tournament/create')}
            >
              <Add />
            </IconButton>
          )}
        </Toolbar>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab label="Todos" />
          <Tab label="Meus torneios" />
          <Tab label="Torneios criados" />
        </Tabs>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {tabValue === 0 && renderTournamentList(tournaments)}
        {tabValue === 1 && renderTournamentList(myTournaments)}
        {tabValue === 2 && renderTournamentList(createdTournaments)}
      </Box>

      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>Filtro de torneios</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.ativos}
                onChange={(e) => setFilters({...filters, ativos: e.target.checked})}
              />
            }
            label="Ativos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.concluidos}
                onChange={(e) => setFilters({...filters, concluidos: e.target.checked})}
              />
            }
            label="Concluídos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.cancelados}
                onChange={(e) => setFilters({...filters, cancelados: e.target.checked})}
              />
            }
            label="Cancelados"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleFilterApply} color="primary">Aplicar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TournamentView;