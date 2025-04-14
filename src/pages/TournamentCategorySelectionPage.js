import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Card,
  Checkbox,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
  Dialog,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TournamentCategorySelectionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { tournamentId, user, userGender, shirtSize } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Form state
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedPartners, setSelectedPartners] = useState({});
  const [partnerShirtSizes, setPartnerShirtSizes] = useState({});
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          `/beach-tennis/tournaments/${tournamentId}/categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        
        // Fetch users
        const usersResponse = await axios.get('/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        setCategories(categoriesResponse.data);
        setUsers(usersResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (tournamentId && user) {
      fetchData();
    }
  }, [tournamentId, user]);

  // Filter categories by gender
  const filteredCategories = categories.filter(category => {
    if (userGender === 'Masculino') {
      return category.gender === 'Mista' || category.gender === 'Masculino';
    } else if (userGender === 'Feminino') {
      return category.gender === 'Mista' || category.gender === 'Feminino';
    }
    return false;
  });

  const simplesCategories = filteredCategories.filter(cat => cat.gameType === 'Simples');
  const duplasCategories = filteredCategories.filter(cat => cat.gameType === 'Duplas');

  const handleCategorySelect = (categoryId, isSelected) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: isSelected
    }));
  };

  const handlePartnerSelect = (categoryId, userId) => {
    setSelectedPartners(prev => ({
      ...prev,
      [categoryId]: userId
    }));
  };

  const handlePartnerShirtSize = (categoryId, size) => {
    setPartnerShirtSizes(prev => ({
      ...prev,
      [categoryId]: size
    }));
  };

  const openPartnerDialog = (category) => {
    setCurrentCategory(category);
    setSearchQuery('');
    setFilteredUsers(
      users.filter(u => 
        u.id !== user.id && 
        (category.gender === 'Mista' || u.gender === category.gender)
      )
    );
    setOpenDialog(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(u => {
        const fullName = `${u.name} ${u.middleName || ''}`.toLowerCase();
        const matchesSearch = fullName.includes(query.toLowerCase());
        const matchesGender = 
          currentCategory.gender === 'Mista' || 
          u.gender === currentCategory.gender;
        
        return u.id !== user.id && matchesGender && matchesSearch;
      })
    );
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedCategories).length === 0) {
      toast.error('Selecione pelo menos uma categoria');
      return;
    }

    try {
      // Register user in tournament
      await axios.post(
        `/beach-tennis/tournament-registrations`,
        {
          user_id: user.id,
          name: user.name,
          email: user.email,
          cpf: user.document,
          phone: user.phone,
          shirt_size: shirtSize,
          gender: user.gender,
          tournament_id: tournamentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      // Register in selected categories
      for (const [categoryId, isSelected] of Object.entries(selectedCategories)) {
        if (isSelected) {
          const category = categories.find(c => c.id === parseInt(categoryId));
          const player2Id = category.gameType === 'Duplas' ? selectedPartners[categoryId] : null;
          
          await axios.post(
            `/beach-tennis/category-registrations`,
            {
              tournament_id: category.tournamentId,
              category_id: category.id,
              player1_id: user.id,
              player2_id: player2Id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            }
          );
        }
      }

      toast.success('Inscrição realizada com sucesso!');
      navigate(-1);
    } catch (err) {
      toast.error('Erro ao realizar inscrição');
      console.error(err);
    }
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
            Selecione suas categorias
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {simplesCategories.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2, ml: 1 }}>
              Categorias Simples
            </Typography>
            {simplesCategories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategories[category.id] || false}
                onSelect={handleCategorySelect}
              />
            ))}
          </>
        )}

        {duplasCategories.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 3, mb: 2, ml: 1 }}>
              Categorias Duplas
            </Typography>
            {duplasCategories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategories[category.id] || false}
                onSelect={handleCategorySelect}
                onPartnerSelect={() => openPartnerDialog(category)}
                partner={selectedPartners[category.id] ? 
                  users.find(u => u.id === selectedPartners[category.id]) : null}
                partnerShirtSize={partnerShirtSizes[category.id]}
              />
            ))}
          </>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ 
              width: '100%',
              maxWidth: 380,
              height: 48,
              borderRadius: '60px'
            }}
          >
            Finalizar Cadastro
          </Button>
        </Box>
      </Box>

      {/* Partner Selection Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6">
              Selecionar Parceiro
            </Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Pesquisar parceiro"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ mb: 2 }}
          />

          {selectedPartners[currentCategory?.id] ? (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2
              }}>
                <Avatar 
                  src={selectedPartners[currentCategory.id]?.imageHash ? 
                    `/images/${selectedPartners[currentCategory.id].imageHash}` : 
                    '/default-avatar.jpg'}
                  sx={{ mr: 2 }}
                />
                <Typography>
                  {selectedPartners[currentCategory.id]?.name} {selectedPartners[currentCategory.id]?.middleName || ''}
                </Typography>
                <IconButton
                  onClick={() => {
                    handlePartnerSelect(currentCategory.id, null);
                    handlePartnerShirtSize(currentCategory.id, null);
                  }}
                  sx={{ ml: 'auto' }}
                >
                  <Close />
                </IconButton>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tamanho da camiseta</InputLabel>
                <Select
                  value={partnerShirtSizes[currentCategory.id] || ''}
                  label="Tamanho da camiseta"
                  onChange={(e) => 
                    handlePartnerShirtSize(currentCategory.id, e.target.value)
                  }
                >
                  {['PP', 'P', 'M', 'G', 'GG'].map(size => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <ListItem 
                    key={user.id}
                    button
                    onClick={() => handlePartnerSelect(currentCategory.id, user.id)}
                  >
                    <Avatar 
                      src={user.imageHash ? 
                        `/images/${user.imageHash}` : 
                        '/default-avatar.jpg'}
                      sx={{ mr: 2 }}
                    />
                    <ListItemText
                      primary={`${user.name} ${user.middleName || ''}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ p: 2, textAlign: 'center' }}>
                  Nenhum parceiro encontrado
                </Typography>
              )}
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              if (selectedPartners[currentCategory.id] && partnerShirtSizes[currentCategory.id]) {
                handleCategorySelect(currentCategory.id, true);
                setOpenDialog(false);
              } else {
                toast.error('Selecione um parceiro e o tamanho da camiseta');
              }
            }}
            sx={{ mt: 2 }}
          >
            Confirmar
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

const CategoryCard = ({ 
  category, 
  isSelected, 
  onSelect, 
  onPartnerSelect, 
  partner,
  partnerShirtSize
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <ListItem>
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            if (category.gameType === 'Duplas' && e.target.checked) {
              onPartnerSelect();
            } else {
              onSelect(category.id, e.target.checked);
            }
          }}
        />
        <ListItemText
          primary={category.name}
          secondary={
            <>
              <Box>Tipo de jogo: {category.gameType}</Box>
              {category.gameType === 'Duplas' && partner && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Avatar 
                      src={partner.imageHash ? 
                        `/images/${partner.imageHash}` : 
                        '/default-avatar.jpg'}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2">
                      {partner.name} {partner.middleName || ''}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Tamanho da camiseta: {partnerShirtSize}
                  </Typography>
                </>
              )}
            </>
          }
        />
      </ListItem>
    </Card>
  );
};

export default TournamentCategorySelectionPage;