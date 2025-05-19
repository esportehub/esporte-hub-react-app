import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
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
} from '@chakra-ui/react';
import { FiHelpCircle, FiSearch, FiCheckCircle, FiX, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { InputLeftElement } from '@chakra-ui/react';

interface Tournament {
  id: number;
  name: string;
  location: string;
  date: string;
  prize: number;
  status: 'ativo' | 'cancelado' | 'concluido' | 'em_breve';
  image: string;
  type: 'torneio' | 'ranking';
}

interface StatusProps {
  color: string;
  icon: React.ElementType;
  text: string;
}

const HomePage = () => {
  const bgColor = 'gray.50';
  const cardBg = 'white';
  const textColor = 'gray.700';

  const router = useRouter();
  const toast = useToast();
  
  // State for the page
  const [featuredTournaments, setFeaturedTournaments] = useState<Tournament[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter tournaments when search text or tournaments change
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredTournaments(tournaments);
    } else {
      const searchLower = searchText.toLowerCase();
      setFilteredTournaments(
        tournaments.filter(tournament =>
          tournament.name.toLowerCase().includes(searchLower) ||
          tournament.location.toLowerCase().includes(searchLower) ||
          tournament.type.toLowerCase().includes(searchLower)
        )
      );
    }
  }, [searchText, tournaments]);

  const fetchFeaturedTournaments = useCallback(async () => {
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
          image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'torneio'
        },
        {
          id: 2,
          name: 'Campeonato Estadual',
          location: 'Clube de Praia',
          date: '20/01/2024',
          prize: 10000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'torneio'
        },
        {
          id: 3,
          name: 'Ranking Nacional',
          location: 'Brasil',
          date: 'Atualizado mensalmente',
          prize: 0,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'ranking'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar torneios em destaque: '+error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchTournaments = useCallback(async () => {
    if (currentPage === -1) return;
    
    setIsLoading(true);
    try {
      // Mock data for demo
      const mockData: Tournament[] = [
        {
          id: 4,
          name: 'Torneio Amador',
          location: 'Parque Esportivo',
          date: '05/01/2024',
          prize: 2000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'torneio'
        },
        {
          id: 5,
          name: 'Liga Profissional',
          location: 'Arena Esportiva',
          date: '10/02/2024',
          prize: 15000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'torneio'
        },
        {
          id: 6,
          name: 'Torneio de Inverno',
          location: 'Ginásio Municipal',
          date: '25/07/2024',
          prize: 8000,
          status: 'em_breve',
          image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'torneio'
        },
        {
          id: 7,
          name: 'Ranking Estadual',
          location: 'Rio de Janeiro',
          date: 'Atualizado semanalmente',
          prize: 0,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'ranking'
        },
        {
          id: 8,
          name: 'Copa das Praias',
          location: 'Praia de Ipanema',
          date: '15/03/2024',
          prize: 12000,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'torneio'
        },
        {
          id: 9,
          name: 'Ranking Municipal',
          location: 'São Paulo',
          date: 'Atualizado quinzenalmente',
          prize: 0,
          status: 'ativo',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'ranking'
        },
        {
          id: 10,
          name: 'Torneio Primavera',
          location: 'Clube Campestre',
          date: '10/09/2024',
          prize: 7500,
          status: 'em_breve',
          image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          type: 'torneio'
        }
      ];
      
      setTournaments(prev => [...prev, ...mockData]);
      if (mockData.length === 0) setCurrentPage(-1);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar torneios: '+error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, toast]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchFeaturedTournaments();
      await fetchTournaments();
    };
    
    fetchData();
  }, [fetchFeaturedTournaments, fetchTournaments]);

  const loadMoreTournaments = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const getStatusProps = (status: Tournament['status']): StatusProps => {
    switch (status) {
      case 'ativo': return { color: 'green', icon: FiCheckCircle, text: 'Ativo' };
      case 'cancelado': return { color: 'red', icon: FiX, text: 'Cancelado' };
      case 'concluido': return { color: 'blue', icon: FiCheck, text: 'Concluído' };
      case 'em_breve': return { color: 'orange', icon: FiHelpCircle, text: 'Em breve' };
      default: return { color: 'gray', icon: FiHelpCircle, text: 'Desconhecido' };
    }
  };

  const renderTournamentCard = (tournament: Tournament, isFeatured: boolean = false) => {
    const statusProps = getStatusProps(tournament.status);
    
    return (
      <Box
        key={tournament.id}
        onClick={() => router.push(`/tournament/${tournament.id}`)}
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
          <Badge
            position="absolute"
            top="2"
            left="2"
            colorScheme={tournament.type === 'ranking' ? 'purple' : 'teal'}
            px="2"
            py="1"
            borderRadius="md"
          >
            {tournament.type === 'ranking' ? 'Ranking' : 'Torneio'}
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
            {tournament.type === 'torneio' && (
              <Text fontSize="sm" color={textColor}>
                <Text as="span" fontWeight="semibold">Prêmio:</Text> R${tournament.prize.toLocaleString()}
              </Text>
            )}
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Layout>
      <Box minH="100vh" bg={bgColor}>
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
              placeholder="Pesquise torneios e rankings (nome, local ou tipo)"
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
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} h="300px" borderRadius="lg" />
              ))}
            </Grid>
          ) : filteredTournaments.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg">
                {searchText ? 'Nenhum torneio ou ranking encontrado' : 'Nenhum torneio ou ranking disponível'}
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
              {filteredTournaments.map(tournament => renderTournamentCard(tournament, false))}
            </Grid>
          )}
          
          {currentPage !== -1 && (
            <Flex justify="center" mt={8}>
              <Button
                colorScheme="green"
                variant="outline"
                onClick={loadMoreTournaments}
                isLoading={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Carregar mais'}
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default HomePage;