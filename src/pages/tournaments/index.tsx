//@typescript-eslint/no-require-imports
//@typescript-eslint/no-explicit-any
//@typescript-eslint/no-unused-vars
//@typescript-eslint/no-unused-expressions
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
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/auth/authContext';
import { NextPageWithAuth } from 'next';

interface Tournament {
  id: string;
  eventName: string;
  status: string;
  registrationStart: string;
  registrationEnd: string;
  createdBy: string;
}

const TournamentsPage: NextPageWithAuth = () => {
  const { appUser, decodedToken } = useAuth();
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

   useEffect(() => {
    if (decodedToken) {
      fetchTournaments();
      //setIsAdmin(decodedToken.role === 'admin');
    }
  }, [decodedToken]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      console.log('Dados recebidos:', response.data);
      
      const allTournaments = response.data.map((tournament: any) => ({
        id: tournament.id,
        eventName: tournament.eventName,
        status: tournament.status?.toLowerCase() || 'ativo',
        registrationStart: tournament.registrationStart,
        registrationEnd: tournament.registrationEnd,
        createdBy: tournament.createdBy
      }));
      
      setTournaments(allTournaments);
      setMyTournaments(allTournaments); // Temporário - mostrar todos para testes
      
      const userCreatedTournaments = allTournaments.filter((t: Tournament) => 
        t.createdBy === appUser?.uid
      );
      setCreatedTournaments(userCreatedTournaments);
      
    } catch (err) {
      console.error('Erro ao buscar torneios:', err);
      setError('Erro ao carregar torneios. Tente novamente mais tarde.');
      toast({
        title: 'Erro',
        description: 'Falha ao carregar torneios',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo': return 'green';
      case 'cancelado': return 'red';
      case 'concluido': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo': return 'Ativo';
      case 'cancelado': return 'Cancelado';
      case 'concluido': return 'Concluído';
      default: return status; // Retorna o valor original se não for um dos esperados
    }
  };

  const filterTournaments = (tournamentsList: Tournament[]) => {
    if (!tournamentsList) return [];
    
    return tournamentsList.filter(tournament => {
      const matchesSearchQuery = tournament.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!isFilterApplied) {
        return matchesSearchQuery;
      }
      
      const matchesStatusFilter = 
        (filterValues.ativos && tournament.status.toLowerCase() === 'ativo') ||
        (filterValues.concluidos && tournament.status.toLowerCase() === 'concluido') ||
        (filterValues.cancelados && tournament.status.toLowerCase() === 'cancelado');
      
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
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderTabContent = () => {
    if (loading) return (
      <Flex justify="center" mt={8}>
        <CircularProgress isIndeterminate />
      </Flex>
    );
    
    if (error) return (
      <Alert status="error" mt={4}>
        {error}
      </Alert>
    );
    
    let filteredTournaments: Tournament[] = [];
    
    switch (tabValue) {
      case 0:
        filteredTournaments = filterTournaments(tournaments);
        break;
      case 1:
        filteredTournaments = filterTournaments(myTournaments);
        break;
      case 2:
        filteredTournaments = filterTournaments(createdTournaments);
        break;
      default:
        filteredTournaments = [];
    }
    
    const pageCount = Math.ceil(filteredTournaments.length / itemsPerPage);
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
          <Text color="gray.500" textAlign="center" mt={4}>
            Nenhum torneio encontrado
          </Text>
        ) : (
          <>
            {paginatedTournaments.map(renderTournamentCard)}
            {pageCount > 1 && (
              <Flex justify="center" mt={6}>
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
            )}
          </>
        )}
      </Box>
    );
  };

  return (
    <Layout>
      <Box flex="1">
        <Flex as="header" bg="white" boxShadow="sm" position="sticky" top="0" zIndex="sticky">
          <Flex align="center" p={4} w="full" maxW="container.xl" mx="auto">
            <IconButton
              aria-label="Voltar"
              icon={<ChevronLeftIcon />}
              onClick={() => router.back()}
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
    </Layout>
  );
};

TournamentsPage.authRequired = true;
export default TournamentsPage;