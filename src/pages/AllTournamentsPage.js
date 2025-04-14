import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Pagination,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { ArrowBack, Search, FilterList, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import TournamentViewPage from './TournamentViewPage';
import TournamentCreationPage from './TournamentCreationPage';
import HomePage from './HomePage';

const AllTournamentsPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [createdTournaments, setCreatedTournaments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    ativos: false,
    concluidos: false,
    cancelados: false
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // User data
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setUser(userResponse.data);
        
        // Check user role
        const roleResponse = await axios.get('/user_role', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setIsAdmin(roleResponse.data.roles.includes('admin'));
        
        // Fetch all tournaments
        const tournamentsResponse = await axios.get('/beach-tennis/tournaments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setTournaments(tournamentsResponse.data);
        
        // Fetch user's tournaments
        if (userResponse.data?.id) {
          const myTournamentsResponse = await axios.get(
            `/beach-tennis/tournament-registrations/tournaments/${userResponse.data.id}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            }
          );
          
          // Fetch details for each tournament
          const tournamentDetails = await Promise.all(
            myTournamentsResponse.data.map(reg => 
              axios.get(`/beach-tennis/tournaments/${reg.tournament_id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
              })
          ));
          
          setMyTournaments(tournamentDetails.map(res => res.data));
          
          // Set created tournaments
          const created = tournamentsResponse.data.filter(
            t => t.ownerId === userResponse.data.id
          );
          setCreatedTournaments(created);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'cancelado': return 'error';
      case 'concluido': return 'warning';
      default: return 'default';
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

  const filterTournaments = (tournamentsList) => {
    return tournamentsList.filter(tournament => {
      const matchesSearchQuery = tournament.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatusFilter = 
        (filterValues.ativos && tournament.status === 'ativo') ||
        (filterValues.concluidos && tournament.status === 'concluido') ||
        (filterValues.cancelados && tournament.status === 'cancelado') ||
        (!isFilterApplied && tournament.status === 'ativo'); // Default to active if no filter
      
      return matchesSearchQuery && matchesStatusFilter;
    });
  };

  const handleFilterApply = () => {
    setIsFilterApplied(
      filterValues.ativos || filterValues.concluidos || filterValues.cancelados
    );
    setFilterOpen(false);
    setCurrentPage(1); // Reset to first page when filters change
    toast.success('Filtros aplicados!');
  };

  const handleFilterReset = () => {
    setFilterValues({
      ativos: false,
      concluidos: false,
      cancelados: false
    });
    setIsFilterApplied(false);
    setFilterOpen(false);
  };

  const renderTournamentCard = (tournament) => {
    return (
      <Card 
        key={tournament.id} 
        sx={{ mb: 2, cursor: 'pointer' }}
        onClick={() => navigate(`/tournament/${tournament.id}`)}
      >
        <CardContent sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src="/assets/images/logo.png" 
              sx={{ mr: 2, bgcolor: 'primary.main' }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{tournament.eventName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Inscrições: {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={getStatusText(tournament.status)}
            color={getStatusColor(tournament.status)}
            size="small"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          />
        </CardContent>
      </Card>
    );
  };

  const formatDate = (dateString) => {
    // Implement your date formatting logic here
    return new Date(dateString).toLocaleDateString();
  };

  const renderTabContent = () => {
    if (loading) return <CircularProgress sx={{ mt: 4 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;
    
    let filteredTournaments = [];
    let totalItems = 0;
    
    switch (tabValue) {
      case 0: // Todos
        filteredTournaments = filterTournaments(tournaments);
        break;
      case 1: // Meus torneios
        filteredTournaments = filterTournaments(myTournaments);
        break;
      case 2: // Torneios criados
        filteredTournaments = filterTournaments(createdTournaments);
        break;
      default:
        filteredTournaments = [];
    }
    
    totalItems = filteredTournaments.length;
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    const paginatedTournaments = filteredTournaments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
          <TextField
            fullWidth
            placeholder={`Pesquisar ${
              tabValue === 0 ? 'todos torneios' : 
              tabValue === 1 ? 'meus torneios' : 'torneios criados'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: <Search color="action" />
            }}
          />
          <Button
            variant="contained"
            color={isFilterApplied ? 'secondary' : 'inherit'}
            startIcon={<FilterList />}
            onClick={() => setFilterOpen(true)}
          >
            Filtrar
          </Button>
        </Box>
        
        {paginatedTournaments.length === 0 ? (
          <Typography variant="body1" color="error" textAlign="center" sx={{ mt: 2 }}>
            Torneios não encontrados neste filtro
          </Typography>
        ) : (
          <>
            {paginatedTournaments.map(renderTournamentCard)}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
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
          onChange={(e, newValue) => {
            setTabValue(newValue);
            setCurrentPage(1);
          }}
          variant="fullWidth"
        >
          <Tab label="Todos" />
          <Tab label="Meus torneios" />
          <Tab label="Torneios criados" />
        </Tabs>
      </AppBar>
      
      {renderTabContent()}
      
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)}>
        <DialogTitle>Filtro de torneios</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterValues.ativos}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  ativos: e.target.checked
                })}
              />
            }
            label="Ativos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterValues.concluidos}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  concluidos: e.target.checked
                })}
              />
            }
            label="Concluídos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterValues.cancelados}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  cancelados: e.target.checked
                })}
              />
            }
            label="Cancelados"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset}>Limpar</Button>
          <Button onClick={handleFilterApply} variant="contained">Aplicar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllTournamentsPage;