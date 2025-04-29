import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  HStack,
  VStack
} from '@chakra-ui/react';
import { ArrowBackIcon, WarningIcon } from '@chakra-ui/icons';
import { FaFutbol, FaTrophy, FaUsers, FaCalendarAlt, FaBook } from 'react-icons/fa';

interface Player {
  id: string;
  name: string;
  imageUrl?: string;
}

interface CategoryRegistration {
  id: string;
  player1?: Player;
  player2?: Player;
}

interface Match {
  id: string;
  groupId: string;
  categoryRegistrationId1: string;
  categoryRegistrationId2: string;
}

interface Group {
  id: string;
  groupNumber: number;
}

const TournamentGroupsPage: React.FC = () => {
  const { tournamentId, categoryId } = useParams<{ tournamentId: string; categoryId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [categoryRegistrations, setCategoryRegistrations] = useState<CategoryRegistration[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { isOpen: isProblemDialogOpen, onOpen: onProblemDialogOpen, onClose: onProblemDialogClose } = useDisclosure();
  const [problemType, setProblemType] = useState<string>('');
  const [problemMessage, setProblemMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkUserRole();
        await Promise.all([
          fetchGroups(),
          fetchMatches(),
          fetchCategoryRegistrations()
        ]);
      } catch (error) {
        toast.error('Error loading data: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId, categoryId]);

  const checkUserRole = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/user_role`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.roles.includes('admin'));
      } else {
        throw new Error('Failed to load user role');
      }
    } catch (error) {
      toast.error('Error fetching user role: ' + (error as Error).message);
    }
  };

  const fetchGroups = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/tournaments/${tournamentId}/categories/${categoryId}/groups`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setGroups(data);
    } else {
      throw new Error('Failed to load groups');
    }
  };

  const fetchMatches = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/tournaments/${tournamentId}/categories/${categoryId}/matches`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setMatches(data);
    } else {
      throw new Error('Failed to load matches');
    }
  };

  const fetchCategoryRegistrations = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/beach-tennis/category-registrations/${categoryId}/${tournamentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCategoryRegistrations(data);
    } else {
      throw new Error('Failed to load category registrations');
    }
  };

  const getPlayerById = (playerId: string): Player | null => {
    for (const registration of categoryRegistrations) {
      if (registration.player1?.id === playerId) return registration.player1;
      if (registration.player2?.id === playerId) return registration.player2;
    }
    return null;
  };

  const getRegistrationById = (registrationId: string): CategoryRegistration | undefined => {
    return categoryRegistrations.find(reg => reg.id === registrationId);
  };

  const handleSubmitProblemReport = () => {
    if (problemType && problemMessage) {
      // Here you would typically send the report to your backend
      console.log('Problem Type:', problemType);
      console.log('Problem Message:', problemMessage);
      toast.success('Problem reported successfully!');
      onProblemDialogClose();
      setProblemType('');
      setProblemMessage('');
    } else {
      toast.warning('Please select a problem type and enter a message');
    }
  };

  const buildGroupWidget = (group: Group) => {
    const groupMatches = matches.filter(match => match.groupId === group.id);
    
    return (
      <Card key={group.id} mb={4}>
        <CardHeader>
          <Heading size="md">Grupo {group.groupNumber}</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            {groupMatches.map((match, index) => (
              <Box key={match.id} mb={4}>
                <Text fontWeight="bold" mb={2}>Partida {index + 1}</Text>
                {buildMatchWidget(match)}
              </Box>
            ))}
          </Stack>
        </CardBody>
      </Card>
    );
  };

  const buildMatchWidget = (match: Match) => {
    const registration1 = getRegistrationById(match.categoryRegistrationId1);
    const registration2 = getRegistrationById(match.categoryRegistrationId2);
    
    const player1 = registration1?.player1;
    const player2 = registration1?.player2;
    const player3 = registration2?.player1;
    const player4 = registration2?.player2;

    return (
      <Card variant="outline" p={4}>
        <Flex justify="space-around" align="center">
          <VStack>
            <Avatar src={player1?.imageUrl} size="md" />
            <Text fontSize="sm" textAlign="center">
              {player1?.name || 'Desconhecido'}
            </Text>
          </VStack>
          
          <VStack>
            <Avatar src={player2?.imageUrl} size="md" />
            <Text fontSize="sm" textAlign="center">
              {player2?.name || 'Desconhecido'}
            </Text>
          </VStack>
          
          <Text fontSize="lg" mx={4}>VS</Text>
          
          <VStack>
            <Avatar src={player3?.imageUrl} size="md" />
            <Text fontSize="sm" textAlign="center">
              {player3?.name || 'Desconhecido'}
            </Text>
          </VStack>
          
          <VStack>
            <Avatar src={player4?.imageUrl} size="md" />
            <Text fontSize="sm" textAlign="center">
              {player4?.name || 'Desconhecido'}
            </Text>
          </VStack>
        </Flex>
      </Card>
    );
  };

  const navButtons = [
    { label: 'Torneio', icon: <FaFutbol />, action: () => navigate(`/tournament/${tournamentId}`) },
    { label: 'Classificação', icon: <FaTrophy />, action: () => {} },
    { label: 'Jogos grupos', icon: <FaUsers />, action: () => {} },
    { label: 'Jogos finais', icon: <FaCalendarAlt />, action: () => navigate(`/tournament/${tournamentId}/bracket`) },
    { label: 'Regras', icon: <FaBook />, action: () => {} },
    { label: 'Relatar Problema', icon: <WarningIcon />, action: onProblemDialogOpen },
  ];

  if (loading) {
    return (
      <Flex justify="center" align="center" minHeight="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex as="header" bg="white" boxShadow="sm" p={4} align="center">
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          mr={4}
        />
        <Heading size="lg" flexGrow={1}>
          Grupos da categoria
        </Heading>
      </Flex>

      <Box p={4} overflowX="auto">
        <HStack spacing={2} mb={4} overflowX="auto" pb={2}>
          {navButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              leftIcon={button.icon}
              onClick={button.action}
              whiteSpace="nowrap"
            >
              {button.label}
            </Button>
          ))}
        </HStack>

        {groups.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Heading size="md">Grupos ainda não sorteados!</Heading>
          </Box>
        ) : (
          groups.map(group => buildGroupWidget(group))
        )}
      </Box>

      {/* Problem Report Modal */}
      <Modal isOpen={isProblemDialogOpen} onClose={onProblemDialogClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Relatar Problema</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Tipo do problema</FormLabel>
              <Select
                placeholder="Selecione o tipo"
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
              >
                <option value="Torneio">Torneio</option>
                <option value="Aplicativo">Aplicativo</option>
                <option value="Grupos">Grupos</option>
                <option value="Sugestão">Sugestão</option>
                <option value="Outro">Outro</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Descreva o problema</FormLabel>
              <Input
                as="textarea"
                rows={4}
                value={problemMessage}
                onChange={(e) => setProblemMessage(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onProblemDialogClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmitProblemReport}>
              Enviar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TournamentGroupsPage;