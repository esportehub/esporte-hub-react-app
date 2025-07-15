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
  SimpleGrid
} from '@chakra-ui/react';
import { FiHelpCircle, FiSearch, FiCheckCircle, FiX, FiCheck, FiChevronLeft, FiChevronRight, FiAward, FiMapPin, FiCalendar } from 'react-icons/fi';
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

const HomePage: NextPageWithAuth = () => {
  const { appUser, decodedToken } = useAuth();

  const bgColor = 'gray.50';
  const cardBg = 'white';
  const textColor = 'gray.700';
  const router = useRouter();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleSportChange = (values: string[]) => {
    setSelectedSports(values);
  };


  const fetchTournaments = useCallback(async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    // Transformar os dados da API para o formato esperado
    const formattedTournaments = response.data.map((tournament: any) => ({
      id: tournament.id,
      name: tournament.eventName,
      location: tournament.tournamentLocation || 'Local não especificado',
      startDate: tournament.tournamentStart,
      endDate: tournament.tournamentEnd,
      prize: tournament.prize || 0,
      status: tournament.status?.toLowerCase() || 'ativo',
      bannerUrl: tournament.imageHash,
      sportType: tournament.sportType || 'BEACH_TENNIS', // Default sport
      registrationDeadline: tournament.registrationEnd,
      isFeatured: tournament.isFeatured || false,
      type: tournament.type || 'torneio'
    }));

   console.log('puxando')

    setTournaments(formattedTournaments);
    setFilteredTournaments(formattedTournaments);
    
    console.log('Torneios carregados:', formattedTournaments);
  } catch (error) {
    console.error('Erro ao carregar torneios:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao carregar torneios. Mostrando dados de exemplo.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
}, [toast]);

useEffect(() => {
  if (decodedToken) {
    fetchTournaments();
  } 
}, [decodedToken,fetchTournaments]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handlePrevClick = () => {
    setCarouselIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextClick = () => {
    setCarouselIndex(prev => prev + 1);
  };

    const handleTournamentClick = (id: string) => {
    console.log("aq")
    router.push(`/tournaments/${id}`);
  };

  const renderTournamentCard = (tournament: Tournament) => {
    const statusProps = getStatusProps(tournament.status);
    const sportProps = getSportProps(tournament.sportType);

    return (
      <Box
        key={tournament.id}
        onClick={() => handleTournamentClick(tournament.id)}
        bg={cardBg}
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
        <Box
          h="200px"
          bg="gray.200"
          overflow="hidden"
          position="relative"
        >
          <Image
            src={tournament.bannerUrl}
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

const renderCarousel = (items: Tournament[], title: string, isFeatured: boolean = false) => {
  const itemsPerView = isMobile ? 1 : 3; // 1 item no mobile, 3 no desktop
  const displayItems = isFeatured ? items.filter(item => item.isFeatured) : items;
  const totalPages = Math.ceil(displayItems.length / itemsPerView);
  const currentPage = carouselIndex;

  const handlePrev = () => {
    setCarouselIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex(prev => Math.min(totalPages - 1, prev + 1));
  };

  // Pega os itens para a página atual
  const startIndex = currentPage * itemsPerView;
  const visibleItems = displayItems.slice(startIndex, startIndex + itemsPerView);

  return (
    <Box mb={12}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl" color={textColor}>
          {title}
        </Heading>
        {displayItems.length > itemsPerView && (
          <Flex>
            <IconButton
              icon={<FiChevronLeft />}
              aria-label="Anterior"
              onClick={handlePrev}
              mr={2}
              isDisabled={currentPage === 0}
            />
            <IconButton
              icon={<FiChevronRight />}
              aria-label="Próximo"
              onClick={handleNext}
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
        <Box textAlign="center" py={10} bg={cardBg} borderRadius="lg">
          <Text fontSize="lg">
            {isFeatured
              ? 'Nenhum torneio em destaque no momento'
              : 'Nenhum torneio encontrado com esses filtros'}
          </Text>
        </Box>
      ) : (
        <Flex
          overflow="hidden"
          position="relative"
          minH="400px"
        >
          <SimpleGrid 
            columns={{ base: 1, md: 3 }}
            gap={6}
            width="100%"
            transition="transform 0.3s ease"
            transform={{
              base: `translateX(-${currentPage * 100}%)`,
              md: 'none'
            }}
          >
            {visibleItems.map(tournament => (
              <Box key={tournament.id}>
                {renderTournamentCard(tournament)}
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      )}
    </Box>
  );
};

  return (
    <Layout>
      <Box minH="100vh" bg={bgColor}>
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
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            mb={10}
            position="relative"
            top="-16"
            zIndex={2}
          >
            <Heading size="lg" mb={4} color="gray.700">
              Encontre seu torneio ideal
            </Heading>

            <InputGroup mb={6}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Pesquise torneios por nome, local ou esporte"
                value={searchText}
                onChange={handleSearchChange}
                size="lg"
              />
            </InputGroup>

            <CheckboxGroup
              value={selectedSports}
              onChange={handleSportChange}
              colorScheme="green"
            >
              <Flex wrap="wrap" gap={6}>
                <Box>
                  <Text fontWeight="semibold" mb={2}>Esportes</Text>
                  <Stack spacing={2}>
                    <Checkbox value="BEACH_TENNIS">Beach Tennis</Checkbox>
                    <Checkbox value="TENNIS">Tênis</Checkbox>
                    <Checkbox value="BEACH_VOLLEYBALL">Vôlei de Praia</Checkbox>
                  </Stack>
                </Box>
              </Flex>
            </CheckboxGroup>
          </Box>

  {renderCarousel(filteredTournaments, 'Torneios em Destaque', true)}
{renderCarousel(filteredTournaments, 'Todos os Torneios')}
        </Box>
      </Box>
    </Layout>
  );
};

HomePage.authRequired = true;
export default HomePage;