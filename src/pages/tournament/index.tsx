import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Card,
  CardBody,
  Avatar,
  Tag,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  useDisclosure,
  Spinner,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, SearchIcon, CheckIcon, CloseIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { IoFilterOutline } from 'react-icons/io5';
import { format } from 'date-fns';

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
  // Add other user properties as needed
}

const TournamentView: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [createdTournaments, setCreatedTournaments] = useState<Tournament[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const [filters, setFilters] = useState({
    ativos: false,
    concluidos: false,
    cancelados: false
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
        await fetchTournaments();
        await checkUserRole();
      } catch (error) {
        toast.error('Error loading data: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

  const fetchUser = async (): Promise<User> => {
    const token = localStorage.getItem('authToken');
    // Mock implementation - replace with actual API call
    const mockUser: User = { id: '1' };
    setUser(mockUser);
    return mockUser;
  };

  const fetchTournament = async (tournamentId: string): Promise<Tournament> => {
    // Mock implementation - replace with actual API call
    return {
      id: tournamentId,
      eventName: 'Mock Tournament',
      status: 'ativo',
      registrationStart: new Date().toISOString(),
      registrationEnd: new Date().toISOString()
    };
  };

  const fetchTournamentsRegistrations = async (userId: string) => {
    try {
      // Mock implementation - replace with actual API call
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          eventName: 'My Tournament 1',
          status: 'ativo',
          registrationStart: new Date().toISOString(),
          registrationEnd: new Date().toISOString()
        },
        {
          id: '2',
          eventName: 'My Tournament 2',
          status: 'concluido',
          registrationStart: new Date().toISOString(),
          registrationEnd: new Date().toISOString()
        }
      ];
      setMyTournaments(mockTournaments);
      setTotalPages(Math.ceil(mockTournaments.length / 5));
    } catch (error) {
      toast.error('Error fetching tournament registrations: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const fetchTournaments = async () => {
    try {
      // Mock implementation - replace with actual API call
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          eventName: 'Tournament 1',
          status: 'ativo',
          registrationStart: new Date().toISOString(),
          registrationEnd: new Date().toISOString(),
          ownerId: '1'
        },
        {
          id: '2',
          eventName: 'Tournament 2',
          status: 'concluido',
          registrationStart: new Date().toISOString(),
          registrationEnd: new Date().toISOString(),
          ownerId: '2'
        },
        {
          id: '3',
          eventName: 'Tournament 3',
          status: 'cancelado',
          registrationStart: new Date().toISOString(),
          registrationEnd: new Date().toISOString(),
          ownerId: '1'
        }
      ];
      setTournaments(mockTournaments);
      setTotalPages(Math.ceil(mockTournaments.length / 5));

      if (user) {
        const created = mockTournaments.filter(t => t.ownerId === user.id);
        setCreatedTournaments(created);
      }
    } catch (error) {
      toast.error('Error fetching tournaments: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const checkUserRole = async () => {
    // Mock implementation - replace with actual API call
    setIsAdmin(true);
  };

  const filterTournaments = (tournaments: Tournament[]) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'green';
      case 'cancelado': return 'red';
      case 'concluido': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <CheckCircleIcon />;
      case 'cancelado': return <CloseIcon />;
      case 'concluido': return <CheckIcon />;
      default: return null;
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

  const handleTabChange = (index: number) => {
    setTabValue(index);
    setCurrentPage(1);
  };

  const handleFilterApply = () => {
    const anyFilterApplied = filters.ativos || filters.concluidos || filters.cancelados;
    setIsFilterApplied(anyFilterApplied);
    setCurrentPage(1);
    onFilterClose();
    toast.success('Filtros aplicados!');
  };

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  const buildTournamentCard = (tournament: Tournament) => {
    return (
      <Card 
        key={tournament.id} 
        mb={4} 
        cursor="pointer"
        onClick={() => navigate(`/tournament/${tournament.id}`)}
        bg={cardBg}
      >
        <CardBody>
          <Stack direction="row" spacing={4} align="center">
            <Avatar src="/logo.png" />
            <Box flex={1}>
              <Heading size="md">{tournament.eventName}</Heading>
              <Text fontSize="sm" color="gray.500">
                Inscrições: {format(new Date(tournament.registrationStart), 'dd/MM/yyyy')} - {format(new Date(tournament.registrationEnd), 'dd/MM/yyyy')}
              </Text>
            </Box>
            <Tag 
              colorScheme={getStatusColor(tournament.status)}
              variant="outline"
              size="md"
              /*leftIcon={getStatusIcon(tournament.status)}*/
            >
              {getStatusText(tournament.status)}
            </Tag>
          </Stack>
        </CardBody>
      </Card>
    );
  };

  const renderTournamentList = (tournamentList: Tournament[]) => {
    const filteredTournaments = filterTournaments(tournamentList);
    const pageCount = Math.ceil(filteredTournaments.length / 5);
    const currentItems = filteredTournaments.slice(
      (currentPage - 1) * 5,
      currentPage * 5
    );

    return (
      <Box>
        <Flex gap={4} mb={4}>
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder={`Pesquisar ${tabValue === 0 ? 'todos torneios' : tabValue === 1 ? 'meus torneios' : 'torneios criados'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Button
            colorScheme={isFilterApplied ? "blue" : "gray"}
            leftIcon={<IoFilterOutline />}
            onClick={onFilterOpen}
          >
            Filtrar
          </Button>
        </Flex>

        {currentItems.length === 0 ? (
          <Text color="red.500" textAlign="center" my={4}>
            Torneios não encontrados neste filtro
          </Text>
        ) : (
          <Box>
            {currentItems.map(tournament => buildTournamentCard(tournament))}
            <Flex justify="center" mt={4}>
              /*
               Adicionar paginacao aqui
               */
            </Flex>
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box flexGrow={1}>
      <Flex as="header" direction="column" bg={headerBg}>
        <Flex p={4} align="center">
          <IconButton
            aria-label="Voltar"
            icon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            mr={4}
          />
          <Heading size="lg" flex={1}>
            Torneios
          </Heading>
          {isAdmin && (
            <IconButton
              aria-label="Criar torneio"
              icon={<AddIcon />}
              onClick={() => navigate('/tournament/create')}
              colorScheme="blue"
            />
          )}
        </Flex>
        <Tabs index={tabValue} onChange={handleTabChange} isFitted variant="enclosed">
          <TabList>
            <Tab>Todos</Tab>
            <Tab>Meus torneios</Tab>
            <Tab>Torneios criados</Tab>
          </TabList>
        </Tabs>
      </Flex>

      <Box p={4}>
        <TabPanels>
          <TabPanel p={0}>
            {renderTournamentList(tournaments)}
          </TabPanel>
          <TabPanel p={0}>
            {renderTournamentList(myTournaments)}
          </TabPanel>
          <TabPanel p={0}>
            {renderTournamentList(createdTournaments)}
          </TabPanel>
        </TabPanels>
      </Box>

      <Modal isOpen={isFilterOpen} onClose={onFilterClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filtro de torneios</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Checkbox
                isChecked={filters.ativos}
                onChange={(e) => setFilters({...filters, ativos: e.target.checked})}
              >
                Ativos
              </Checkbox>
              <Checkbox
                isChecked={filters.concluidos}
                onChange={(e) => setFilters({...filters, concluidos: e.target.checked})}
              >
                Concluídos
              </Checkbox>
              <Checkbox
                isChecked={filters.cancelados}
                onChange={(e) => setFilters({...filters, cancelados: e.target.checked})}
              >
                Cancelados
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onFilterClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleFilterApply}>
              Aplicar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TournamentView;