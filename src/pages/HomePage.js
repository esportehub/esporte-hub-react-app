import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Menu,
  Search,
  ExitToApp,
  Event,
  CheckCircle,
  Cancel,
  Check,
  Help
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import logo from "../assets/images/esporte-hub-logo.png"

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State for the page
  const [featuredTournaments, setFeaturedTournaments] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchUserData();
    fetchFeaturedTournaments();
    fetchTournaments();
  }, []);

  // Filter tournaments when search text changes
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredTournaments(tournaments);
    } else {
      setFilteredTournaments(
        tournaments.filter(tournament =>
          tournament.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, tournaments]);

  const fetchUserData = async () => {
    try {
      // Simulate API call
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/me`);
      // const data = await response.json();
      // setUser(data);
      // fetchUserImage(data.imageHash);
      
      // Mock data for demo
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        imageHash: '12345'
      });
      setUserImage('/assets/images/default-avatar.jpg');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load user data',
        severity: 'error'
      });
    }
  };

  const fetchFeaturedTournaments = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments/featured`);
      // const data = await response.json();
      // setFeaturedTournaments(data);
      
      // Mock data for demo
      setFeaturedTournaments([
        {
          id: 1,
          name: 'Torneio de Verão',
          tournamentLocation: 'Praia Copacabana',
          tournamentStartDate: '15/12/2023',
          prizeValue: 5000,
          status: 'ativo',
          imageHash: 'tournament1'
        },
        {
          id: 2,
          name: 'Campeonato Estadual',
          tournamentLocation: 'Clube de Praia',
          tournamentStartDate: '20/01/2024',
          prizeValue: 10000,
          status: 'ativo',
          imageHash: 'tournament2'
        }
      ]);
    } catch (error) {
      console.error('Error fetching featured tournaments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load featured tournaments',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTournaments = async () => {
    if (currentPage === -1) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments?page=${currentPage}`);
      // const data = await response.json();
      
      // Mock data for demo
      const mockData = [
        {
          id: 3,
          name: 'Torneio Amador',
          tournamentLocation: 'Parque Esportivo',
          tournamentStartDate: '05/01/2024',
          prizeValue: 2000,
          status: 'ativo',
          imageHash: 'tournament3'
        },
        {
          id: 4,
          name: 'Liga Profissional',
          tournamentLocation: 'Arena Esportiva',
          tournamentStartDate: '10/02/2024',
          prizeValue: 15000,
          status: 'ativo',
          imageHash: 'tournament4'
        }
      ];
      
      setTournaments(prev => [...prev, ...mockData]);
      if (mockData.length === 0) setCurrentPage(-1);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load tournaments',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreTournaments = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
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

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
          )}
          
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: 40,
              flexGrow: isMobile ? 1 : 0,
              objectFit: 'contain'
            }}
          />
          
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Chip
                label="Beach Tennis"
                color="primary"
                variant="outlined"
                sx={{ mx: 1 }}
              />
              <Chip
                label="Futevolei"
                variant="outlined"
                sx={{ mx: 1 }}
              />
            </Box>
          )}
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => navigate('/me')}
            sx={{ ml: 2 }}
          >
            <Avatar
              src={userImage}
              alt={user?.name}
              sx={{
                width: 40,
                height: 40,
                border: `2px solid ${theme.palette.primary.main}`
              }}
            />
          </IconButton>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar for desktop */}
        {!isMobile && (
          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 240,
                boxSizing: 'border-box',
                borderRight: 'none'
              }
            }}
          >
            <List>
              <ListItem button onClick={() => navigate('/tournaments/creation')}>
                <ListItemIcon><Event /></ListItemIcon>
                <ListItemText primary="Criar Torneio" secondary="Criar torneio" />
              </ListItem>

              <ListItem button onClick={() => navigate('/categories/creation')}>
                <ListItemIcon><Event /></ListItemIcon>
                <ListItemText primary="Criar Categoria" secondary="Criar categoria" />
              </ListItem>

              <ListItem button onClick={() => navigate('/tournaments')}>
                <ListItemIcon><Event /></ListItemIcon>
                <ListItemText primary="Ver torneios" secondary="Mostrar todos os torneios" />
              </ListItem>

            </List>
            <Box sx={{ mt: 'auto', p: 2 }}>
              <Button
                fullWidth
                startIcon={<ExitToApp />}
                onClick={() => navigate('/login')}
              >
                Sair
              </Button>
            </Box>
          </Drawer>
        )}

        {/* Mobile drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem button onClick={() => navigate('/tournaments/creation')}>
                <ListItemIcon><Event /></ListItemIcon>
                <ListItemText primary="Criar Torneio" secondary="Criar torneio" />
              </ListItem>
              <ListItem button onClick={() => navigate('/tournaments')}>
                <ListItemIcon><Event /></ListItemIcon>
                <ListItemText primary="Ver torneios" secondary="Mostrar todos os torneios" />
              </ListItem>
            </List>
            <Box sx={{ mt: 'auto', p: 2 }}>
              <Button
                fullWidth
                startIcon={<ExitToApp />}
                onClick={() => navigate('/login')}
              >
                Sair
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* Featured Tournaments */}
          {featuredTournaments.length > 0 && (
            <>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Torneios em Destaque
              </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: 3,
                  mb: 5
                }}
              >
                {featuredTournaments.map((tournament) => (
                  <Box
                    key={tournament.id}
                    onClick={() => navigate(`/tournament/${tournament.id}`)}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 1,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body1">Imagem do Torneio</Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1
                        }}
                      >
                        <Typography variant="h6" noWrap>
                          {tournament.name}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(tournament.status)}
                          label={getStatusText(tournament.status)}
                          color={getStatusColor(tournament.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Local: {tournament.tournamentLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data: {tournament.tournamentStartDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Prêmio: R${tournament.prizeValue.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* All Tournaments */}
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Torneios e Rankings
          </Typography>
          
          <TextField
            fullWidth
            placeholder="Pesquise torneios e rankings"
            variant="outlined"
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <Search sx={{ color: 'action.active', mr: 1 }} />
              )
            }}
            sx={{ mb: 3 }}
          />
          
          {isLoading && filteredTournaments.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredTournaments.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography>
                {searchText ? 'Nenhum torneio encontrado' : 'Nenhum torneio disponível'}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 3
              }}
            >
              {filteredTournaments.map((tournament) => (
                <Box
                  key={tournament.id}
                  onClick={() => navigate(`/tournament/${tournament.id}`)}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      cursor: 'pointer'
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body1">Imagem do Torneio</Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {tournament.name}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(tournament.status)}
                        label={getStatusText(tournament.status)}
                        color={getStatusColor(tournament.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Local: {tournament.tournamentLocation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data: {tournament.tournamentStartDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prêmio: R${tournament.prizeValue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          
          {currentPage !== -1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={loadMoreTournaments}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Carregar mais'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;