import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Card,
  CardBody,
  Avatar,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Stack,
  Text,
  useToast,
  Progress,
  CircularProgress,
  Alert,
  IconButton
} from '@chakra-ui/react';
import { 
  ChevronLeftIcon,
  SearchIcon,
  AddIcon
} from '@chakra-ui/icons';
import { IoFilterOutline } from 'react-icons/io5';
import axios from 'axios';

interface Tournament {
  id: string;
  eventName: string;
  status: 'ativo' | 'cancelado' | 'concluido';
  registrationStart: string;
  registrationEnd: string;
  ownerId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const AllTournamentsPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [createdTournaments, setCreatedTournaments] = useState<Tournament[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  const [user, setUser] = useState<User | null>(null);

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
            myTournamentsResponse.data.map((reg: any) => 
              axios.get(`/beach-tennis/tournaments/${reg.tournament_id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
              })
          ));
          
          setMyTournaments(tournamentDetails.map(res => res.data));
          
          // Set created tournaments
          const created = tournamentsResponse.data.filter(
            (t: Tournament) => t.ownerId === userResponse.data.id
          );
          setCreatedTournaments(created);
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'green';
      case 'cancelado': return 'red';
      case 'concluido': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'cancelado': return 'Cancelado';
      case 'concluido': return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  const filterTournaments = (tournamentsList: Tournament[]) => {
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
    setCurrentPage(1);
    toast({
      title: 'Filtros aplicados!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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

  const renderTournamentCard = (tournament: Tournament) => {
    return (
      <Card 
        key={tournament.id} 
        mb={4} 
        cursor="pointer"
        onClick={() => router.push(`/tournament/${tournament.id}`)}
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        transition="all 0.2s"
      >
        <CardBody>
          <Flex align="center">
            <Avatar 
              src="/assets/images/logo.png" 
              mr={4} 
              bg="blue.500"
            />
            <Box flex="1">
              <Heading size="md">{tournament.eventName}</Heading>
              <Text color="gray.600" fontSize="sm">
                Inscrições: {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
              </Text>
            </Box>
            <Tag 
              colorScheme={getStatusColor(tournament.status)}
              size="sm"
              position="absolute"
              top={4}
              right={4}
            >
              {getStatusText(tournament.status)}
            </Tag>
          </Flex>
        </CardBody>
      </Card>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderTabContent = () => {
    if (loading) return <CircularProgress isIndeterminate mt={8} />;
    if (error) return <Alert status="error">{error}</Alert>;
    
    let filteredTournaments: Tournament[] = [];
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
      <Box p={4}>
        <Flex mb={4} gap={4}>
          <InputGroup flex="1">
            <Input
              placeholder={`Pesquisar ${
                tabValue === 0 ? 'todos torneios' : 
                tabValue === 1 ? 'meus torneios' : 'torneios criados'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputRightElement>
              <SearchIcon color="gray.500" />
            </InputRightElement>
          </InputGroup>
          <Button
            colorScheme={isFilterApplied ? 'blue' : 'gray'}
            leftIcon={<IoFilterOutline />}
            onClick={() => setFilterOpen(true)}
          >
            Filtrar
          </Button>
        </Flex>
        
        {paginatedTournaments.length === 0 ? (
          <Text color="red.500" textAlign="center" mt={4}>
            Nenhum torneio encontrado com esses filtros
          </Text>
        ) : (
          <>
            {paginatedTournaments.map(renderTournamentCard)}
            <Flex justify="center" mt={6}>
              {/* Chakra UI doesn't have a built-in Pagination component, so we'll use buttons */}
              {Array.from({ length: pageCount }).map((_, index) => (
                <Button
                  key={index}
                  mx={1}
                  colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </Flex>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box flex="1">
      <Flex as="header" bg="white" boxShadow="sm" position="sticky" top="0" zIndex="sticky">
        <Flex align="center" p={4} w="full" maxW="container.xl" mx="auto">
          <IconButton
            aria-label="Voltar"
            icon={<ChevronLeftIcon />}
            onClick={() => router.push('/')}
            mr={4}
          />
          <Heading size="lg" flex="1">
            Torneios
          </Heading>
          {isAdmin && (
            <IconButton
              aria-label="Criar torneio"
              icon={<AddIcon />}
              colorScheme="blue"
              onClick={() => router.push('/tournament/create')}
            />
          )}
        </Flex>
      </Flex>

      <Tabs 
        index={tabValue}
        onChange={(index) => {
          setTabValue(index);
          setCurrentPage(1);
        }}
        isFitted
        variant="enclosed"
      >
        <TabList>
          <Tab>Todos</Tab>
          <Tab>Meus torneios</Tab>
          <Tab>Torneios criados</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>{renderTabContent()}</TabPanel>
          <TabPanel p={0}>{renderTabContent()}</TabPanel>
          <TabPanel p={0}>{renderTabContent()}</TabPanel>
        </TabPanels>
      </Tabs>
      
      <Modal isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filtrar torneios</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <Checkbox
                isChecked={filterValues.ativos}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  ativos: e.target.checked
                })}
              >
                Ativos
              </Checkbox>
              <Checkbox
                isChecked={filterValues.concluidos}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  concluidos: e.target.checked
                })}
              >
                Concluídos
              </Checkbox>
              <Checkbox
                isChecked={filterValues.cancelados}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  cancelados: e.target.checked
                })}
              >
                Cancelados
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={handleFilterReset}>Limpar</Button>
            <Button colorScheme="blue" ml={3} onClick={handleFilterApply}>
              Aplicar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AllTournamentsPage;