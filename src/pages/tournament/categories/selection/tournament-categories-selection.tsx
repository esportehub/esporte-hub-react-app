import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  FormControl,
  FormLabel,
  Spinner,
  useDisclosure,
  Stack,
  Divider,
  Checkbox,
  ListItem,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { ArrowBackIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  middleName?: string;
  email: string;
  document: string;
  phone: string;
  gender: string;
  imageHash?: string;
}

interface Category {
  id: number;
  name: string;
  gameType: 'Simples' | 'Duplas';
  gender: 'Masculino' | 'Feminino' | 'Mista';
  tournamentId: number;
}

const TournamentCategorySelectionPage: React.FC = () => {
  const router = useRouter();
  const location = useLocation();
  const toast = useToast();
  
  const { tournamentId, user, userGender, shirtSize } = location.state as {
    tournamentId: string;
    user: User;
    userGender: string;
    shirtSize: string;
  } || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Form state
  const [selectedCategories, setSelectedCategories] = useState<Record<number, boolean>>({});
  const [selectedPartners, setSelectedPartners] = useState<Record<number, string>>({});
  const [partnerShirtSizes, setPartnerShirtSizes] = useState<Record<number, string>>({});
  
  // Modal state
  const { isOpen: isPartnerModalOpen, onOpen: onPartnerModalOpen, onClose: onPartnerModalClose } = useDisclosure();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

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
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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

  const handleCategorySelect = (categoryId: number, isSelected: boolean) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: isSelected
    }));
  };

  const handlePartnerSelect = (categoryId: number, userId: string) => {
    setSelectedPartners(prev => ({
      ...prev,
      [categoryId]: userId
    }));
  };

  const handlePartnerShirtSize = (categoryId: number, size: string) => {
    setPartnerShirtSizes(prev => ({
      ...prev,
      [categoryId]: size
    }));
  };

  const openPartnerModal = (category: Category) => {
    setCurrentCategory(category);
    setSearchQuery('');
    setFilteredUsers(
      users.filter(u => 
        u.id !== user.id && 
        (category.gender === 'Mista' || u.gender === category.gender)
      )
    );
    onPartnerModalOpen();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(u => {
        const fullName = `${u.name} ${u.middleName || ''}`.toLowerCase();
        const matchesSearch = fullName.includes(query.toLowerCase());
        const matchesGender = 
          currentCategory?.gender === 'Mista' || 
          u.gender === currentCategory?.gender;
        
        return u.id !== user.id && matchesGender && matchesSearch;
      })
    );
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedCategories).length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos uma categoria',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
          const player2Id = category?.gameType === 'Duplas' ? selectedPartners[parseInt(categoryId)] : null;
          
          if (category) {
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
      }

      toast({
        title: 'Sucesso',
        description: 'Inscrição realizada com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.back
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao realizar inscrição',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" mt={4}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Flex 
        as="header" 
        bg="white" 
        boxShadow="sm" 
        p={4} 
        align="center"
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          onClick={() => router.back}
          mr={4}
        />
        <Heading size="lg" flexGrow={1}>
          Selecione suas categorias
        </Heading>
      </Flex>

      <Box p={4}>
        {simplesCategories.length > 0 && (
          <>
            <Heading size="md" mb={4} ml={1}>
              Categorias Simples
            </Heading>
            <Stack spacing={4}>
              {simplesCategories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories[category.id] || false}
                  onSelect={handleCategorySelect}
                />
              ))}
            </Stack>
          </>
        )}

        {duplasCategories.length > 0 && (
          <>
            <Heading size="md" mt={6} mb={4} ml={1}>
              Categorias Duplas
            </Heading>
            <Stack spacing={4}>
              {duplasCategories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories[category.id] || false}
                  onSelect={handleCategorySelect}
                  onPartnerSelect={() => openPartnerModal(category)}
                  partner={selectedPartners[category.id] ? 
                    users.find(u => u.id === selectedPartners[category.id]) : undefined}
                  partnerShirtSize={partnerShirtSizes[category.id]}
                />
              ))}
            </Stack>
          </>
        )}

        <Flex mt={8} justify="center">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSubmit}
            width="100%"
            maxWidth="380px"
            height="48px"
            borderRadius="60px"
          >
            Finalizar Cadastro
          </Button>
        </Flex>
      </Box>

      {/* Partner Selection Modal */}
      <Modal 
        isOpen={isPartnerModalOpen} 
        onClose={onPartnerModalClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justify="space-between" align="center">
              <Text>Selecionar Parceiro</Text>
              <IconButton 
                aria-label="Close modal"
                icon={<CloseIcon />}
                onClick={onPartnerModalClose}
                variant="ghost"
              />
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Pesquisar parceiro"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              mb={4}
            />

            {currentCategory && selectedPartners[currentCategory.id] ? (
              <>
                <Flex align="center" mb={4}>
                  <Avatar 
                    src={selectedPartners[currentCategory.id] ? 
                      `/images/${users.find(u => u.id === selectedPartners[currentCategory.id])?.imageHash}` : 
                      '/default-avatar.jpg'}
                    mr={3}
                  />
                  <Text>
                    {users.find(u => u.id === selectedPartners[currentCategory.id])?.name} {users.find(u => u.id === selectedPartners[currentCategory.id])?.middleName || ''}
                  </Text>
                  <IconButton
                    aria-label="Remove partner"
                    icon={<CloseIcon />}
                    onClick={() => {
                      handlePartnerSelect(currentCategory.id, '');
                      handlePartnerShirtSize(currentCategory.id, '');
                    }}
                    ml="auto"
                    variant="ghost"
                  />
                </Flex>

                <FormControl mb={4}>
                  <FormLabel>Tamanho da camiseta</FormLabel>
                  <Select
                    placeholder="Selecione o tamanho"
                    value={partnerShirtSizes[currentCategory.id] || ''}
                    onChange={(e) => 
                      handlePartnerShirtSize(currentCategory.id, e.target.value)
                    }
                  >
                    {['PP', 'P', 'M', 'G', 'GG'].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              <Box maxH="400px" overflowY="auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <ListItem 
                      key={user.id}
                      p={3}
                      _hover={{ bg: 'gray.100' }}
                      cursor="pointer"
                      onClick={() => handlePartnerSelect(currentCategory?.id || 0, user.id)}
                    >
                      <Avatar 
                        src={user.imageHash ? 
                          `/images/${user.imageHash}` : 
                          '/default-avatar.jpg'}
                        mr={3}
                      />
                      <Text>
                        {user.name} {user.middleName || ''}
                      </Text>
                    </ListItem>
                  ))
                ) : (
                  <Text p={4} textAlign="center">
                    Nenhum parceiro encontrado
                  </Text>
                )}
              </Box>
            )}

            <Button
              colorScheme="blue"
              width="full"
              mt={4}
              onClick={() => {
                if (currentCategory && selectedPartners[currentCategory.id] && partnerShirtSizes[currentCategory.id]) {
                  handleCategorySelect(currentCategory.id, true);
                  onPartnerModalClose();
                } else {
                  toast({
                    title: 'Erro',
                    description: 'Selecione um parceiro e o tamanho da camiseta',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
            >
              Confirmar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: number, isSelected: boolean) => void;
  onPartnerSelect?: () => void;
  partner?: User;
  partnerShirtSize?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  isSelected, 
  onSelect, 
  onPartnerSelect, 
  partner,
  partnerShirtSize
}) => {
  return (
    <Card variant="outline">
      <Flex p={4} align="center">
        <Checkbox
          isChecked={isSelected}
          onChange={(e) => {
            if (category.gameType === 'Duplas' && e.target.checked && onPartnerSelect) {
              onPartnerSelect();
            } else {
              onSelect(category.id, e.target.checked);
            }
          }}
          mr={4}
        />
        <Box flex={1}>
          <Text fontWeight="bold">{category.name}</Text>
          <Text>Tipo de jogo: {category.gameType}</Text>
          {category.gameType === 'Duplas' && partner && (
            <>
              <Flex align="center" mt={2}>
                <Avatar 
                  src={partner.imageHash ? 
                    `/images/${partner.imageHash}` : 
                    '/default-avatar.jpg'}
                  size="sm"
                  mr={2}
                />
                <Text fontSize="sm">
                  {partner.name} {partner.middleName || ''}
                </Text>
              </Flex>
              <Text fontSize="sm">
                Tamanho da camiseta: {partnerShirtSize}
              </Text>
            </>
          )}
        </Box>
      </Flex>
    </Card>
  );
};

export default TournamentCategorySelectionPage;