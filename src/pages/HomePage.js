import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  InputGroup,
  Button,
  Avatar,
  IconButton,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  List,
  ListItem,
  ListIcon,
  useDisclosure,
  useBreakpointValue,
  Image,
  Badge,
  Divider,
  Stack,
  Skeleton,
  CircularProgress
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { DrawerOverlay, DrawerCloseButton } from '@chakra-ui/modal';
import { InputLeftElement } from '@chakra-ui/input';
import { FiHelpCircle } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';
import {
  FiMenu,
  FiSearch,
  FiLogOut,
  FiCalendar,
  FiCheckCircle,
  FiX,
  FiCheck,
  FiHome,
  FiPlus,
  FiAward
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/esporte-hub-logo.png";

const HomePage = () => {
  const borderColor = 'gray.200';         // Cinza claro para bordas
  const primaryColor = '#149E4C';         // Verde principal (mantido)
  const secondaryColor = '#195E35';       // Verde mais escuro (mantido)
  const bgColor = 'gray.50';              // Fundo cinza bem claro
  const cardBg = 'white';                 // Fundo branco para cards
  const textColor = 'gray.700';  

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // State for the page
  const [featuredTournaments, setFeaturedTournaments] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);

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
      // Mock data for demo
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://bit.ly/dan-abramov'
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar dados do usuário',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchFeaturedTournaments = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo
      setFeaturedTournaments([
        {
          id: 1,
          name: 'Torneio de Verão',
          location: 'Praia Copacabana',
          date: '15/12/2023',
          prize: 5000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 2,
          name: 'Campeonato Estadual',
          location: 'Clube de Praia',
          date: '20/01/2024',
          prize: 10000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      ]);
    } catch (error) {
      console.error('Error fetching featured tournaments:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar torneios em destaque',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTournaments = async () => {
    if (currentPage === -1) return;
    
    setIsLoading(true);
    try {
      // Mock data for demo
      const mockData = [
        {
          id: 3,
          name: 'Torneio Amador',
          location: 'Parque Esportivo',
          date: '05/01/2024',
          prize: 2000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 4,
          name: 'Liga Profissional',
          location: 'Arena Esportiva',
          date: '10/02/2024',
          prize: 15000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 5,
          name: 'Torneio de Inverno',
          location: 'Ginásio Municipal',
          date: '25/07/2024',
          prize: 8000,
          status: 'em_breve',
          image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      ];
      
      setTournaments(prev => [...prev, ...mockData]);
      if (mockData.length === 0) setCurrentPage(-1);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar torneios',
        status: 'error',
        duration: 5000,
        isClosable: true,
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

  const getStatusProps = (status) => {
    switch (status) {
      case 'ativo':
        return { 
          color: 'green', 
          icon: FiCheckCircle, 
          text: 'Ativo' 
        };
      case 'cancelado':
        return { 
          color: 'red', 
          icon: FiX, 
          text: 'Cancelado' 
        };
      case 'concluido':
        return { 
          color: 'blue', 
          icon: FiCheck, 
          text: 'Concluído' 
        };
      case 'em_breve':
        return { 
          color: 'orange', 
          icon: FiHelpCircle, 
          text: 'Em breve' 
        };
      default:
        return { 
          color: 'gray', 
          icon: FiHelpCircle, 
          text: 'Desconhecido' 
        };
    }
  };

  const renderTournamentCard = (tournament, isFeatured = false) => {
    const statusProps = getStatusProps(tournament.status);
    
    return (
      <Box
        key={tournament.id}
        onClick={() => navigate(`/tournament/${tournament.id}`)}
        bg={cardBg}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'xl',
          cursor: 'pointer'
        }}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Box
          h={isFeatured ? "200px" : "160px"}
          bg="gray.200"
          overflow="hidden"
          position="relative"
        >
          <Image
            src={tournament.image}
            alt={tournament.name}
            objectFit="cover"
            w="100%"
            h="100%"
          />
          <Badge
            position="absolute"
            top="2"
            right="2"
            colorScheme={statusProps.color}
            px="2"
            py="1"
            borderRadius="md"
            display="flex"
            alignItems="center"
          >
            <Icon as={statusProps.icon} mr="1" />
            {statusProps.text}
          </Badge>
        </Box>
        <Box p="4" flex="1" display="flex" flexDirection="column">
          <Heading size="md" mb="2" noOfLines={1}>
            {tournament.name}
          </Heading>
          
          <Stack spacing="1" mt="auto">
            <Text fontSize="sm" color={textColor}>
              <Text as="span" fontWeight="semibold">Local:</Text> {tournament.location}
            </Text>
            <Text fontSize="sm" color={textColor}>
              <Text as="span" fontWeight="semibold">Data:</Text> {tournament.date}
            </Text>
            <Text fontSize="sm" color={textColor}>
              <Text as="span" fontWeight="semibold">Prêmio:</Text> R${tournament.prize.toLocaleString()}
            </Text>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Flex
        as="header"
        bg="black"
        color="white"
        px={{ base: 4, md: 6 }}
        py={4}
        align="center"
        justify="space-between"
        position="sticky"
        top="0"
        zIndex="sticky"
        boxShadow="sm"
      >
        <Flex align="center">
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              variant="ghost"
              color="white"
              fontSize="20px"
              mr={2}
              onClick={onOpen}
              aria-label="Abrir menu"
            />
          )}
          
          <Image 
            src={logo} 
            alt="EsporteHub" 
            h={{ base: '30px', md: '40px' }} 
            objectFit="contain"
          />
        </Flex>
        
        {!isMobile && (
          <Flex align="center" gap={2}>
            <Button variant="ghost" colorScheme="green" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
              Beach Tennis
            </Button>
            <Button variant="ghost" colorScheme="green" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
              Futevolei
            </Button>
          </Flex>
        )}
        
        <Avatar 
          src={user?.avatar} 
          name={user?.name} 
          size="sm" 
          cursor="pointer"
          onClick={() => navigate('/me')}
          border={`2px solid ${primaryColor}`}
        />
      </Flex>

      {/* Main Content */}
      <Flex>
        {/* Sidebar - Desktop */}
        {!isMobile && (
          <Box
            as="aside"
            w="240px"
            minH="calc(100vh - 72px)"
            bg={cardBg}
            borderRight="1px solid"
           borderColor={borderColor}
            py={4}
          >
            <List spacing={1} px={2}>
              <ListItem>
                <Button
                  w="full"
                  justifyContent="flex-start"
                  leftIcon={<FiHome />}
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => navigate('/')}
                >
                  Início
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  w="full"
                  justifyContent="flex-start"
                  leftIcon={<FiPlus />}
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => navigate('/tournaments/creation')}
                >
                  Criar Torneio
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  w="full"
                  justifyContent="flex-start"
                  leftIcon={<FiPlus />}
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => navigate('/categories/creation')}
                >
                  Criar Categoria
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  w="full"
                  justifyContent="flex-start"
                  leftIcon={<FiAward />}
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => navigate('/tournaments')}
                >
                  Ver Torneios
                </Button>
              </ListItem>
            </List>
            
            <Box mt="auto" px={2} pt={4}>
              <Button
                w="full"
                leftIcon={<FiLogOut />}
                colorScheme="red"
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Sair
              </Button>
            </Box>
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg={cardBg}>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody>
              <List spacing={3}>
                <ListItem>
                  <Button
                    w="full"
                    justifyContent="flex-start"
                    leftIcon={<FiHome />}
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => {
                      navigate('/');
                      onClose();
                    }}
                  >
                    Início
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    w="full"
                    justifyContent="flex-start"
                    leftIcon={<FiPlus />}
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => {
                      navigate('/tournaments/creation');
                      onClose();
                    }}
                  >
                    Criar Torneio
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    w="full"
                    justifyContent="flex-start"
                    leftIcon={<FiAward />}
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => {
                      navigate('/tournaments');
                      onClose();
                    }}
                  >
                    Ver Torneios
                  </Button>
                </ListItem>
              </List>
              
              <Box mt="8">
                <Button
                  w="full"
                  leftIcon={<FiLogOut />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    navigate('/login');
                    onClose();
                  }}
                >
                  Sair
                </Button>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content Area */}
        <Box flex="1" p={{ base: 4, md: 6 }} maxW="1200px" mx="auto">
          {/* Featured Tournaments */}
          {featuredTournaments.length > 0 && (
            <>
              <Heading size="xl" mb={6} color={textColor}>
                Torneios em Destaque
              </Heading>
              
              <Grid
                templateColumns={{
                  base: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                }}
                gap={6}
                mb={10}
              >
                {featuredTournaments.map(tournament => 
                  renderTournamentCard(tournament, true)
                )}
              </Grid>
            </>
          )}

          {/* All Tournaments */}
          <Heading size="xl" mb={6} color={textColor}>
            Torneios e Rankings
          </Heading>
          
          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Pesquise torneios e rankings"
              value={searchText}
              onChange={handleSearchChange}
              bg={cardBg}
            />
          </InputGroup>
          
          {isLoading && filteredTournaments.length === 0 ? (
            <Grid
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              }}
              gap={6}
            >
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} h="300px" borderRadius="lg" />
              ))}
            </Grid>
          ) : filteredTournaments.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg">
                {searchText ? 'Nenhum torneio encontrado' : 'Nenhum torneio disponível'}
              </Text>
            </Box>
          ) : (
            <Grid
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              }}
              gap={6}
            >
              {filteredTournaments.map(renderTournamentCard)}
            </Grid>
          )}
          
          {currentPage !== -1 && (
            <Flex justify="center" mt={8}>
              <Button
                colorScheme="green"
                variant="outline"
                onClick={loadMoreTournaments}
                isLoading={isLoading}
                leftIcon={!isLoading && <FiPlus />}
              >
                {isLoading ? 'Carregando...' : 'Carregar mais'}
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default HomePage;