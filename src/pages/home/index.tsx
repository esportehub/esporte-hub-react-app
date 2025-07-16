import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  InputGroup,
  Button,
  Badge,
  Stack,
  Skeleton,
  useToast,
  Icon,
  Image,
  Flex,
  useBreakpointValue,
  IconButton,
  Checkbox,
  CheckboxGroup,
  InputLeftElement,
  SimpleGrid,
  FormLabel,
  Select,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Divider
} from '@chakra-ui/react';
import {
  FiHelpCircle,
  FiSearch,
  FiCheckCircle,
  FiX,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiMapPin,
  FiCalendar,
  FiFilter
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { NextPageWithAuth } from 'next';
import axios from 'axios';
import { useAuth } from '@/hooks/auth/authContext';

interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  prize: number;
  status: 'ativo' | 'cancelado' | 'concluido' | 'em_breve';
  bannerUrl: string;
  sportType: 'BEACH_TENNIS' | 'TENNIS' | 'BEACH_VOLLEYBALL';
  registrationDeadline: string;
  isFeatured?: boolean;
  type: 'torneio' | 'ranking';
}

interface StatusProps {
  color: string;
  icon: React.ElementType;
  text: string;
}

interface FilterOptions {
  searchText: string;
  selectedSports: string[];
  selectedState: string;
  selectedCity: string;
  startDate: string;
  endDate: string;
  tournamentType: string;
}

const HomePage: NextPageWithAuth = () => {
  const { decodedToken } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    selectedSports: [],
    selectedState: '',
    selectedCity: '',
    startDate: '',
    endDate: '',
    tournamentType: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<Tournament[]>([]);

  // Estados para opções de filtro
  const [states, setStates] = useState([
    { value: 'SP', label: 'São Paulo' },
    { value: 'PR', label: 'Paraná' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'RJ', label: 'Rio de Janeiro' }
  ]);

  const [cities, setCities] = useState([
    { value: 'maringa', label: 'Maringá' },
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'curitiba', label: 'Curitiba' },
    { value: 'florianopolis', label: 'Florianópolis' }
  ]);

  // Busca torneios
  const fetchTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const formattedTournaments = response.data.map((tournament: any) => ({
        id: tournament.id,
        name: tournament.eventName,
        location: tournament.tournamentLocation || 'Local não especificado',
        startDate: tournament.tournamentStart,
        endDate: tournament.tournamentEnd,
        prize: tournament.prize || 0,
        status: tournament.status?.toLowerCase() || 'ativo',
        bannerUrl: tournament.imageHash,
        sportType: tournament.sportType || 'BEACH_TENNIS',
        registrationDeadline: tournament.registrationEnd,
        isFeatured: tournament.isFeatured || false,
        type: tournament.type || 'torneio'
      }));

      setTournaments(formattedTournaments);
    } catch (error) {
      console.error('Erro ao carregar torneios:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar torneios.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Aplica filtros para a pesquisa
  const applySearchFilters = () => {
    const {
      searchText,
      selectedSports,
      selectedState,
      selectedCity,
      startDate,
      endDate,
      tournamentType
    } = filters;

    let filtered = [...tournaments];

    if (searchText) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchText.toLowerCase()) ||
        t.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedSports.length > 0) {
      filtered = filtered.filter(t => selectedSports.includes(t.sportType));
    }

    if (selectedState) {
      filtered = filtered.filter(t => t.location.includes(selectedState));
    }

    if (selectedCity) {
      filtered = filtered.filter(t => t.location.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(t => new Date(t.startDate) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(t => new Date(t.endDate) <= end);
    }

    if (tournamentType) {
      filtered = filtered.filter(t => t.type === tournamentType);
    }

    setSearchResults(filtered);
    onOpen(); // Abre o modal com os resultados
  };

  // Handlers
  const handleFilterChange = (name: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSportChange = (values: string[]) => {
    handleFilterChange('selectedSports', values);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('searchText', e.target.value);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('selectedState', e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('selectedCity', e.target.value);
  };

  const handleDateChange = (name: 'startDate' | 'endDate', value: string) => {
    handleFilterChange(name, value);
  };

  const handleTournamentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('tournamentType', e.target.value);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const resetFilters = () => {
    setFilters({
      searchText: '',
      selectedSports: [],
      selectedState: '',
      selectedCity: '',
      startDate: '',
      endDate: '',
      tournamentType: ''
    });
  };

  // Utils
  const getStatusProps = (status: Tournament['status']): StatusProps => {
    switch (status) {
      case 'ativo': return { color: 'green', icon: FiCheckCircle, text: 'Ativo' };
      case 'cancelado': return { color: 'red', icon: FiX, text: 'Cancelado' };
      case 'concluido': return { color: 'blue', icon: FiCheck, text: 'Concluído' };
      case 'em_breve': return { color: 'orange', icon: FiHelpCircle, text: 'Em breve' };
      default: return { color: 'gray', icon: FiHelpCircle, text: 'Desconhecido' };
    }
  };

  const getSportProps = (sportType: Tournament['sportType']) => {
    switch (sportType) {
      case 'BEACH_TENNIS': return { color: 'teal', text: 'Beach Tennis' };
      case 'TENNIS': return { color: 'blue', text: 'Tênis' };
      case 'BEACH_VOLLEYBALL': return { color: 'purple', text: 'Vôlei de Praia' };
      default: return { color: 'gray', text: 'Outro' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleTournamentClick = (id: string) => {
    router.push(`/tournaments/${id}`);
  };

  // Carousel controls
  const handlePrevClick = () => setCarouselIndex(prev => Math.max(0, prev - 1));
  const handleNextClick = () => setCarouselIndex(prev => prev + 1);

  // Effects
  useEffect(() => {
    if (decodedToken) {
      fetchTournaments();
    }
  }, [decodedToken, fetchTournaments]);

  // Componentes
  const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
    const statusProps = getStatusProps(tournament.status);
    const sportProps = getSportProps(tournament.sportType);

    return (
      <Box
        onClick={() => handleTournamentClick(tournament.id)}
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="xl"
        transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: '2xl',
          cursor: 'pointer'
        }}
        minW={{ base: '280px', md: '320px' }}
        mx={2}
      >
        <Box h="200px" bg="gray.200" overflow="hidden" position="relative">
          <Box
            bgImage='url("https://www.saocarlosclube.com.br/images/2019/04_abril/noticias/beach_tenis_800.jpg")'
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
            borderRadius="full"
            display="flex"
            alignItems="center"
            boxShadow="md"
          >
            <Icon as={statusProps.icon} mr="1" />
            {statusProps.text}
          </Badge>
          <Badge
            position="absolute"
            top="2"
            left="2"
            colorScheme={sportProps.color}
            px="2"
            py="1"
            borderRadius="full"
            boxShadow="md"
          >
            {sportProps.text}
          </Badge>
        </Box>
        <Box p="4" flex="1" display="flex" flexDirection="column">
          <Heading size="md" mb="2" noOfLines={1} color="gray.800">
            {tournament.name}
          </Heading>

          <Stack spacing="2" mt="auto">
            <Flex align="center">
              <Icon as={FiMapPin} color="gray.500" mr="2" />
              <Text fontSize="sm" color="gray.600">{tournament.location}</Text>
            </Flex>
            <Flex align="center">
              <Icon as={FiCalendar} color="gray.500" mr="2" />
              <Text fontSize="sm" color="gray.600">
                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
              </Text>
            </Flex>
            {tournament.prize > 0 && (
              <Flex align="center">
                <Icon as={FiAward} color="gray.500" mr="2" />
                <Text fontSize="sm" color="gray.600">
                  Prêmio: R$ {tournament.prize.toLocaleString('pt-BR')}
                </Text>
              </Flex>
            )}
          </Stack>
        </Box>
      </Box>
    );
  };

  const TournamentsCarousel = ({
    items,
    title,
    isFeatured = false
  }: {
    items: Tournament[];
    title: string;
    isFeatured?: boolean
  }) => {
    const itemsPerView = isMobile ? 1 : 3;
    const displayItems = isFeatured ? items.filter(item => item.isFeatured) : items;
    const totalPages = Math.ceil(displayItems.length / itemsPerView);
    const currentPage = carouselIndex;

    const visibleItems = displayItems.slice(
      currentPage * itemsPerView,
      (currentPage + 1) * itemsPerView
    );

    return (
      <Box mb={12}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="xl" color="gray.700">
            {title}
          </Heading>
          {displayItems.length > itemsPerView && (
            <Flex>
              <IconButton
                icon={<FiChevronLeft />}
                aria-label="Anterior"
                onClick={handlePrevClick}
                mr={2}
                isDisabled={currentPage === 0}
              />
              <IconButton
                icon={<FiChevronRight />}
                aria-label="Próximo"
                onClick={handleNextClick}
                isDisabled={currentPage >= totalPages - 1}
              />
            </Flex>
          )}
        </Flex>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {[...Array(itemsPerView)].map((_, i) => (
              <Skeleton key={i} h="350px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : displayItems.length === 0 ? (
          <Box textAlign="center" py={10} bg="white" borderRadius="lg">
            <Text fontSize="lg">
              {isFeatured
                ? 'Nenhum torneio na região de Maringá encontrado'
                : 'Nenhum torneio encontrado'}
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {visibleItems.map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    );
  };

  return (
    <Layout>
      <Box minH="100vh" bg="gray.50">
        {/* Hero Section */}
        <Box
          bgImage="url('https://www.rj.gov.br/esporte/sites/default/files/imagem_noticias/53287410919_d2d6107fbf_o-min.jpg')"
          bgSize="cover"
          bgPosition="center"
          py={20}
          px={4}
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'rgba(0, 0, 0, 0.55)',
            zIndex: 1
          }}
        >
          <Box position="relative" zIndex={2} maxW="1200px" mx="auto">
            <Heading
              as="h1"
              size="2xl"
              color="white"
              mb={6}
              textShadow="0 2px 4px rgba(0,0,0,0.5)"
            >
              Descubra os melhores torneios esportivos
            </Heading>
            <Text
              fontSize="xl"
              color="white"
              mb={8}
              textShadow="0 1px 2px rgba(0,0,0,0.5)"
              maxW="600px"
            >
              Participe dos maiores eventos de beach tennis, tênis e vôlei de praia do país
            </Text>
            <Button
              colorScheme="green"
              size="lg"
              onClick={() => router.push('/tournaments')}
            >
              Explorar Torneios
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box flex="1" p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
          {/* Filtros */}
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="md"
            mb={10}
            position="relative"
            top="-16"
            zIndex={2}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="lg" color="gray.700">
                Encontre seu torneio ideal
              </Heading>
              <Button
                leftIcon={<FiFilter />}
                variant="outline"
                onClick={toggleAdvancedFilters}
                size="sm"
              >
                {showAdvancedFilters ? 'Menos filtros' : 'Mais filtros'}
              </Button>
            </Flex>

            {/* Barra de pesquisa */}
            <InputGroup mb={6}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Pesquise torneios por nome, local ou esporte"
                value={filters.searchText}
                onChange={handleSearchChange}
                size="lg"
              />
            </InputGroup>

            {/* Filtros avançados */}
            {showAdvancedFilters && (
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                {/* Localização */}
                <Box>
                  <FormLabel fontWeight="semibold">Localização</FormLabel>
                  <Stack spacing={3}>
                    <Select
                      placeholder="Selecione o estado"
                      value={filters.selectedState}
                      onChange={handleStateChange}
                    >
                      {states.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </Select>
                    <Select
                      placeholder="Selecione a cidade"
                      value={filters.selectedCity}
                      onChange={handleCityChange}
                      isDisabled={!filters.selectedState}
                    >
                      {cities.map(city => (
                        <option key={city.value} value={city.value}>{city.label}</option>
                      ))}
                    </Select>
                  </Stack>
                </Box>

                {/* Datas */}
                <Box>
                  <FormLabel fontWeight="semibold">Período de/até</FormLabel>
                  <Stack spacing={3}>
                    <Input
                      type="date"
                      placeholder="Data inicial"
                      value={filters.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                    />
                    <Input
                      type="date"
                      placeholder="Data final"
                      value={filters.endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                    />
                  </Stack>
                </Box>

                {/* Esportes e Tipo */}
<Box>
  {/* Seção de Esportes */}
  <Box mb={4}>
    <FormLabel fontWeight="semibold">Esportes</FormLabel>
    <CheckboxGroup
      value={filters.selectedSports}
      onChange={handleSportChange}
      colorScheme="green"
    >
      <Stack spacing={3} mt={2}>
        <Checkbox value="BEACH_TENNIS">Beach Tennis</Checkbox>
        <Checkbox value="TENNIS">Tênis</Checkbox>
        <Checkbox value="BEACH_VOLLEYBALL">Vôlei de Praia</Checkbox>
      </Stack>
    </CheckboxGroup>
  </Box>

  {/* Divisor visual */}
  <Divider my={4} borderColor="gray.200" />

  {/* Seção de Tipo de Torneio */}
  <Box>
    <FormLabel fontWeight="semibold">Tipo de Torneio</FormLabel>
    <CheckboxGroup
      value={filters.tournamentType ? [filters.tournamentType] : []}
      onChange={(values) => handleFilterChange('tournamentType', values[0] || '')}
      colorScheme="blue"
    >
      <Stack spacing={3} mt={2}>
        <Checkbox value="torneio">Torneio</Checkbox>
        <Checkbox value="ranking">Ranking</Checkbox>
      </Stack>
    </CheckboxGroup>
  </Box>
</Box>
              </SimpleGrid>
            )}

            {/* Ações */}
            <Flex justify="space-between" mt={4}>
              <Button
                variant="link"
                colorScheme="blue"
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
              <Button
                colorScheme="blue"
                onClick={applySearchFilters}
              >
                Pesquisar Torneios
              </Button>
            </Flex>
          </Box>

          {/* Carrosséis (não são afetados pelos filtros) */}
          <TournamentsCarousel
            items={tournaments}
            title="Torneios em sua Região"
            isFeatured={true}
          />
          <TournamentsCarousel
            items={tournaments}
            title="Todos os Torneios"
          />
        </Box>

        {/* Modal de resultados da pesquisa */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Resultados da Pesquisa</ModalHeader>
            <ModalBody>Sua busca retornou {searchResults.length} registros.</ModalBody>
            <ModalCloseButton />
            <ModalBody>
              {searchResults.length === 0 ? (
                <Text>Nenhum torneio encontrado com os filtros aplicados.</Text>
              ) : (
                <SimpleGrid columns={1} spacing={4}>
                  {searchResults.map(tournament => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
                </SimpleGrid>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

HomePage.authRequired = true;
export default HomePage;