//@typescript-eslint/no-explicit-any
//@typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Card,
  CardBody,
  CircularProgress,
  Container,
  IconButton,
  Grid,
  Text,
  useTheme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Stack,
  Heading
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  StarIcon,
  RepeatIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { FaCamera } from 'react-icons/fa';
import { IoPersonSharp, IoTennisballOutline } from 'react-icons/io5';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  about: string;
  imageUrl: string;
  stats: {
    tournamentsPlayed: number;
    rankingsPlayed: number;
    activeTournaments: number;
    winStreak: number;
  };
}

interface InfoCard {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

interface ProfileButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

const ProfilePage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Mock data
        const mockUser: User = {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          about: 'Beach tennis enthusiast and tournament player',
          imageUrl: '/assets/images/default-avatar.jpg',
          stats: {
            tournamentsPlayed: 10,
            rankingsPlayed: 5,
            activeTournaments: 2,
            winStreak: 3
          }
        };
        
        setUser(mockUser);
        setUserImage(mockUser.imageUrl);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = () => {
    setUploadingImage(true);
    setTimeout(() => {
      setUploadingImage(false);
    }, 1500);
  };

  const handleLogout = () => {
    setLogoutModal(true);
    setTimeout(() => {
      setLogoutModal(false);
      router.push('/login');
    }, 2000);
  };

  const infoCards: InfoCard[] = [
    { icon: <IoTennisballOutline />, title: 'Torneios jogados no ano', value: user?.stats?.tournamentsPlayed || '0' },
    { icon: <StarIcon boxSize={6} />, title: 'Rankings jogados no ano', value: user?.stats?.rankingsPlayed || '0' },
    { icon: <RepeatIcon boxSize={6} />, title: 'Torneios/Rankings em andamento', value: user?.stats?.activeTournaments || '0' },
    { icon: <StarIcon boxSize={6} />, title: 'Sequência de vitórias', value: user?.stats?.winStreak || '0' }
  ];

  const profileButtons: ProfileButton[] = [
    { icon: <IoPersonSharp color="blue.500" />, label: 'Dados Pessoais', action: () => router.push('/me/profile/personal-data') },
    { icon: <ChevronRightIcon boxSize={6} color="blue.500" />, label: 'Sair', action: handleLogout }
  ];

  if (loading) {
    return (
      <Flex justify="center" align="center" minHeight="100vh">
        <CircularProgress isIndeterminate color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box bg="gray.50" minHeight="100vh">
      {/* Header */}
      <Flex
        as="header"
        bg="white"
        boxShadow="sm"
        py={4}
      >
        <Container maxW="container.lg" display="flex" alignItems="center">
          <IconButton 
            aria-label="Voltar" 
            icon={<ArrowBackIcon />} 
            onClick={() => router.back()} 
            mr={2}
          />
          <Heading as="h1" size="md" flexGrow={1}>
            Meu perfil
          </Heading>
        </Container>
      </Flex>

      {/* Profile Content */}
      <Container maxW="container.lg" py={6}>
        {/* Profile Header */}
        <Box textAlign="center" mb={8}>
          <Box position="relative" display="inline-block" mb={4}>
            <Avatar
              src={userImage || ''}
              name={`${user?.firstName} ${user?.lastName}`}
              size="xl"
              border="4px solid"
              borderColor="blue.500"
            />
            <IconButton
              aria-label="Alterar foto"
              icon={uploadingImage ? <CircularProgress isIndeterminate size="24px" color="white" /> : <FaCamera  />}
              onClick={handleImageUpload}
              position="absolute"
              bottom={0}
              right={0}
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              size="sm"
            />
          </Box>

          <Heading as="h2" size="lg" mb={2}>
            {user?.firstName} {user?.lastName}
          </Heading>
          
          <Text 
            bgGradient="linear(to-r, blue.500, teal.500)"
            bgClip="text"
            fontWeight="bold"
            mb={2}
          >
            @{user?.username}
          </Text>
          
          <Text color="gray.600" maxWidth="600px" mx="auto">
            {user?.about || 'Sem informações cadastradas.'}
          </Text>
        </Box>

        {/* Stats Cards */}
        <Flex overflowX="auto" py={4} mb={8} gap={4}>
          {infoCards.map((card, index) => (
            <Card
              key={index}
              bgGradient="linear(to-r, blue.500, teal.500)"
              color="white"
              borderRadius="xl"
              boxShadow="md"
              minW="200px"
              flex="none"
            >
              <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6}>
                {card.icon}
                <Text fontSize="sm" mt={2} textAlign="center">
                  {card.title}
                </Text>
                <Heading as="h3" size="xl" mt={2}>
                  {card.value}
                </Heading>
              </CardBody>
            </Card>
          ))}
        </Flex>

        {/* Profile Actions */}
        <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap={4}>
          {profileButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.action}
              variant="outline"
              height="auto"
              py={6}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              {button.icon}
              <Text mt={2}>{button.label}</Text>
            </Button>
          ))}
        </Grid>
      </Container>

      {/* Logout Modal */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Stack direction="column" align="center" p={6}>
              <CircularProgress isIndeterminate color="blue.500" size="48px" />
              <Heading size="md" mt={4}>
                Saindo...
              </Heading>
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button onClick={() => setLogoutModal(false)} colorScheme="blue">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProfilePage;