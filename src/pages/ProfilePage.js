import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Typography,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  CameraAlt,
  SportsTennis,
  Leaderboard,
  Autorenew,
  Star,
  Person,
  ExitToApp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

// Styled components
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline'
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  borderRadius: 16,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  margin: theme.spacing(0, 1)
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
  },
  transition: 'all 0.3s ease'
}));

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Mock user data - replace with your API calls
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API call
        // const response = await fetch('/api/user');
        // const data = await response.json();
        
        // Mock data
        const mockUser = {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          about: 'Beach tennis enthusiast and tournament player',
          imageUrl: '/assets/images/default-avatar.jpg',
          stats: {
            tournamentsPlayed: 10,
            rankingsPlayed: 5,
            activeTournaments: 2,
            winStreak: 3
          }
        };
        
        setUser(mockUser);
        setUserImage(mockUser.imageUrl);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = () => {
    // Implement image upload logic
    setUploadingImage(true);
    // Simulate upload
    setTimeout(() => {
      setUploadingImage(false);
      // Show success message
    }, 1500);
  };

  const handleLogout = () => {
    setLogoutModal(true);
    // Simulate logout process
    setTimeout(() => {
      setLogoutModal(false);
      navigate('/login');
    }, 2000);
  };

  const infoCards = [
    { icon: <SportsTennis fontSize="large" />, title: 'Torneios jogados no ano', value: user?.stats?.tournamentsPlayed || '0' },
    { icon: <Leaderboard fontSize="large" />, title: 'Rankings jogados no ano', value: user?.stats?.rankingsPlayed || '0' },
    { icon: <Autorenew fontSize="large" />, title: 'Torneios/Rankings em andamento', value: user?.stats?.activeTournaments || '0' },
    { icon: <Star fontSize="large" />, title: 'Sequência de vitórias', value: user?.stats?.winStreak || '0' }
  ];

  const profileButtons = [
    { icon: <Person fontSize="large" color="primary" />, label: 'Dados Pessoais', action: () => navigate('/profile/personal-data') },
    { icon: <ExitToApp fontSize="large" color="primary" />, label: 'Sair', action: handleLogout }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Meu perfil
          </Typography>
        </Container>
      </AppBar>

      {/* Profile Content */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Profile Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Avatar
              src={userImage}
              alt={user?.username}
              sx={{
                width: 120,
                height: 120,
                border: `4px solid ${theme.palette.primary.main}`,
                position: 'relative'
              }}
            />
            <IconButton
              onClick={handleImageUpload}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              {uploadingImage ? <CircularProgress size={24} color="inherit" /> : <CameraAlt />}
            </IconButton>
          </Box>

          <Typography variant="h5" gutterBottom>
            {user?.firstName} {user?.lastName}
          </Typography>
          
          <GradientText variant="subtitle1" gutterBottom>
            @{user?.username}
          </GradientText>
          
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {user?.about || 'Sem informações cadastradas.'}
          </Typography>
        </Box>

        {/* Stats Carousel */}
        <Box sx={{ height: 200, mb: 4 }}>
          <Box sx={{ display: 'flex', overflowX: 'auto', py: 2 }}>
            {infoCards.map((card, index) => (
              <InfoCard key={index}>
                {card.icon}
                <Typography variant="subtitle2" align="center" sx={{ mt: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {card.value}
                </Typography>
              </InfoCard>
            ))}
          </Box>
        </Box>

        {/* Profile Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {profileButtons.map((button, index) => (
            <ProfileButton
              key={index}
              onClick={button.action}
              variant="contained"
              disableElevation
            >
              {button.icon}
              <Typography variant="body2" sx={{ mt: 1 }}>
                {button.label}
              </Typography>
            </ProfileButton>
          ))}
        </Box>
      </Container>

      {/* Logout Modal */}
      <Dialog open={logoutModal} onClose={() => setLogoutModal(false)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <CircularProgress size={48} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Saindo...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setLogoutModal(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;