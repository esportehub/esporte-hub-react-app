import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Icon,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const TournamentWithdrawalsPage = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Visibility toggles
  const [totalToReceiveVisible, setTotalToReceiveVisible] = useState(false);
  const [totalPaidVisible, setTotalPaidVisible] = useState(false);
  const [totalNotPaidVisible, setTotalNotPaidVisible] = useState(false);
  
  // Tournament data
  const [dataCollection, setDataCollection] = useState({
    totalSubscribedPlayers: '0',
    totalToReceive: '0.00',
    totalPaid: '0.00',
    totalNotPaid: '0.00'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check user role
        const roleResponse = await axios.get('/user_role', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setIsAdmin(roleResponse.data.roles.includes('admin'));
        
        // Fetch tournament data collection
        const dataResponse = await axios.get(
          `/beach-tennis/tournaments/${tournamentId}/data_collections`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        
        setDataCollection(dataResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tournamentId]);

  const buildInfoCard = ({
    icon,
    value,
    label,
    backgroundColor,
    iconColor = theme.palette.text.primary,
    isVisible,
    onVisibilityToggle
  }) => {
    return (
      <Card sx={{ 
        borderRadius: 4,
        backgroundColor,
        color: iconColor,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Icon sx={{ fontSize: 48 }}>{icon}</Icon>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" component="div">
              {isVisible ? `R$ ${value}` : '*******'}
            </Typography>
            {onVisibilityToggle && (
              <IconButton 
                onClick={onVisibilityToggle}
                sx={{ color: iconColor }}
              >
                {isVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            )}
          </Box>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {label}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
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
            Levantamentos
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Players Section (Admin Only) */}
        {isAdmin && (
          <Card sx={{ 
            borderRadius: 4,
            backgroundColor: theme.palette.primary.main,
            mb: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Icon sx={{ 
                  fontSize: 48,
                  color: 'white',
                  mr: 2
                }}>
                  supervisor_account
                </Icon>
                <Box>
                  <Typography variant="h2" sx={{ color: 'white' }}>
                    {dataCollection.totalSubscribedPlayers}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    Participantes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Financial Withdrawals Section */}
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Levantamentos Financeiros
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            {buildInfoCard({
              icon: 'attach_money',
              value: dataCollection.totalToReceive,
              label: 'Total a receber',
              backgroundColor: theme.palette.primary.main,
              iconColor: 'white',
              isVisible: totalToReceiveVisible,
              onVisibilityToggle: () => setTotalToReceiveVisible(!totalToReceiveVisible)
            })}
          </Grid>
          <Grid item xs={12} md={4}>
            {buildInfoCard({
              icon: 'check_circle',
              value: dataCollection.totalPaid,
              label: 'Total recebido',
              backgroundColor: theme.palette.success.main,
              iconColor: 'white',
              isVisible: totalPaidVisible,
              onVisibilityToggle: () => setTotalPaidVisible(!totalPaidVisible)
            })}
          </Grid>
          <Grid item xs={12} md={4}>
            {buildInfoCard({
              icon: 'hourglass_empty',
              value: dataCollection.totalNotPaid,
              label: 'Ainda não recebido',
              backgroundColor: theme.palette.error.main,
              iconColor: 'white',
              isVisible: totalNotPaidVisible,
              onVisibilityToggle: () => setTotalNotPaidVisible(!totalNotPaidVisible)
            })}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TournamentWithdrawalsPage;