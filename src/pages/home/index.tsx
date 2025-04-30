import { Box, Grid, Heading, Text, Input, InputGroup, Button, Badge, Stack, Skeleton, Icon, Image, useToast } from '@chakra-ui/react';
import { FiHelpCircle, FiSearch, FiCheckCircle, FiX, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';

interface Tournament {
  id: number;
  name: string;
  location: string;
  date: string;
  prize: number;
  status: 'ativo' | 'cancelado' | 'concluido' | 'em_breve';
  image: string;
}

interface StatusProps {
  color: string;
  icon: React.ElementType;
  text: string;
}

const HomePage = () => {
  const router = useRouter();
  const toast = useToast();
  const [featuredTournaments, setFeaturedTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeaturedTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data
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
  }, [toast]);

  useEffect(() => {
    fetchFeaturedTournaments();
  }, [fetchFeaturedTournaments]);

  const getStatusProps = (status: Tournament['status']): StatusProps => {
    switch (status) {
      case 'ativo': return { color: 'green', icon: FiCheckCircle, text: 'Ativo' };
      case 'cancelado': return { color: 'red', icon: FiX, text: 'Cancelado' };
      case 'concluido': return { color: 'blue', icon: FiCheck, text: 'Concluído' };
      case 'em_breve': return { color: 'orange', icon: FiHelpCircle, text: 'Em breve' };
      default: return { color: 'gray', icon: FiHelpCircle, text: 'Desconhecido' };
    }
  };

  const renderTournamentCard = (tournament: Tournament) => {
    const statusProps = getStatusProps(tournament.status);
    
    return (
      <Box
        key={tournament.id}
        onClick={() => router.push(`/tournament/${tournament.id}`)}
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', cursor: 'pointer' }}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Box h="200px" bg="gray.200" overflow="hidden" position="relative">
          <Image src={tournament.image} alt={tournament.name} objectFit="cover" w="100%" h="100%" />
          <Badge position="absolute" top="2" right="2" colorScheme={statusProps.color} px="2" py="1" borderRadius="md">
            <Icon as={statusProps.icon} mr="1" />
            {statusProps.text}
          </Badge>
        </Box>
        <Box p="4" flex="1">
          <Heading size="md" mb="2" noOfLines={1}>{tournament.name}</Heading>
          <Stack spacing="1">
            <Text fontSize="sm"><Text as="span" fontWeight="semibold">Local:</Text> {tournament.location}</Text>
            <Text fontSize="sm"><Text as="span" fontWeight="semibold">Data:</Text> {tournament.date}</Text>
            <Text fontSize="sm"><Text as="span" fontWeight="semibold">Prêmio:</Text> R${tournament.prize.toLocaleString()}</Text>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Layout>
      <Box bg="gray.50" p={{ base: 4, md: 6 }}>
        <Heading size="xl" mb={6}>Torneios em Destaque</Heading>
        
        {isLoading ? (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} h="300px" borderRadius="lg" />
            ))}
          </Grid>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {featuredTournaments.map(renderTournamentCard)}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default HomePage;