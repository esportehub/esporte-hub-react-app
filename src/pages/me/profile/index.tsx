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
  ModalHeader,
  Stack,
  Heading,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tag,
  TagLabel,
  useToast
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
import { useAuth } from '@/hooks/auth/useAuth';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

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

interface UserFormData {
  name: string;
  middleName: string;
  document: string;
  email: string;
  phone: string;
  birthday: Date | null;
  about: string;
  gender: string;
}

const ProfilePage = () => {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { decodedToken, appUser } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    middleName: '',
    document: '',
    email: '',
    phone: '',
    birthday: null,
    about: '',
    gender: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const genderOptions = ['Feminino', 'Masculino'];

  useEffect(() => {
    if (decodedToken) {
      console.log('Usuário autenticado:', decodedToken.name, decodedToken.email);
      if (appUser) {
        setFormData({
          name: appUser.name || '',
          middleName: appUser.middleName || '',
          document: appUser.document || '',
          email: appUser.email || '',
          phone: appUser.phone || '',
          birthday: new Date(),
          about: appUser.about || '',
          gender: appUser.gender || ''
        });
      }
    }
  }, [decodedToken, appUser]);

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

  const handlePersonalDataClick = () => {
    onOpen();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      birthday: date
    }));
  };

  const handleGenderChange = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      //const formattedDate = formData.birthday ? format(formData.birthday, 'yyyy-MM-dd') : null;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${decodedToken?.user_id}`,
        {
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          about: formData.about,
          document: formData.document,
          //birthday: formattedDate
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Informações atualizadas com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      toast({
        title: 'Erro ao atualizar dados do usuário',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const infoCards: InfoCard[] = [
    { icon: <IoTennisballOutline />, title: 'Torneios jogados no ano', value: '1'},
    { icon: <StarIcon boxSize={6} />, title: 'Rankings jogados no ano', value: '0' },
    { icon: <RepeatIcon boxSize={6} />, title: 'Torneios/Rankings em andamento', value: '0' },
    { icon: <StarIcon boxSize={6} />, title: 'Sequência de vitórias', value: '0' }
  ];

  const profileButtons: ProfileButton[] = [
    { icon: <IoPersonSharp color="blue.500" />, label: 'Dados Pessoais', action: handlePersonalDataClick },
    { icon: <ChevronRightIcon boxSize={6} color="blue.500" />, label: 'Sair', action: handleLogout }
  ];

  if (isLoading) {
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
              name={`${appUser?.name} ${appUser?.middleName ?? ''}`}
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
            {appUser?.name} {appUser?.middleName ?? ''}
          </Heading>
          
          <Text 
            bgGradient="linear(to-r, blue.500, teal.500)"
            bgClip="text"
            fontWeight="bold"
            mb={2}
          >
            @{appUser?.username ?? '@no-username'}
          </Text>
          
          <Text color="gray.600" maxWidth="600px" mx="auto">
            {appUser?.about || 'Sem informações cadastradas.'}
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

      {/* Personal Data Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <IconButton
                icon={<ArrowBackIcon />}
                aria-label="Voltar"
                onClick={onClose}
                variant="ghost"
                mr={2}
              />
              <Heading size="md">Meus dados pessoais</Heading>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="bold">Nome</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isReadOnly={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="bold">Sobrenome</FormLabel>
                      <Input
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        isReadOnly={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="bold">Email</FormLabel>
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        isReadOnly={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="bold">Documento CPF</FormLabel>
                      <Input
                        name="document"
                        value={formData.document}
                        onChange={handleChange}
                        isReadOnly={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="bold">Telefone WhatsApp</FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel"
                        isReadOnly={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="bold">Data de Nascimento</FormLabel>
                      <Box
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="gray.200"
                        p={1}
                      >
                        <DatePicker
                          selected={formData.birthday}
                          onChange={handleDateChange}
                          disabled={!isEditing}
                          dateFormat="dd/MM/yyyy"
                          locale={ptBR}                
                          customInput={
                            <Input
                              isReadOnly={!isEditing}
                              hidden={true}
                              value={formData.birthday ? format(formData.birthday, 'dd/MM/yyyy') : ''}
                            />
                          }
                        />
                      </Box>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="bold">Sobre você, {formData.name}</FormLabel>
                      <Textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        placeholder="Esportes que pratica, seus pontos fortes, disponibilidade, etc."
                        rows={5}
                        isReadOnly={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="bold">Gênero</FormLabel>
                      {formData.gender && !isEditing ? (
                        <Tag size="lg" colorScheme="blue" borderRadius="full">
                          <TagLabel>{formData.gender}</TagLabel>
                        </Tag>
                      ) : (
                        <Stack direction="row" spacing={2}>
                          {genderOptions.map((option) => (
                            <Tag
                              key={option}
                              size="lg"
                              cursor={isEditing ? "pointer" : "default"}
                              onClick={isEditing ? () => handleGenderChange(option) : undefined}
                              colorScheme={formData.gender === option ? 'blue' : 'gray'}
                              variant={formData.gender === option ? 'solid' : 'outline'}
                            >
                              <TagLabel>{option}</TagLabel>
                            </Tag>
                          ))}
                        </Stack>
                      )}
                    </FormControl>

                    <Flex justify="flex-end" gap={4} mt={6}>
                      {!isEditing ? (
                        <Button
                          colorScheme="blue"
                          onClick={() => setIsEditing(true)}
                        >
                          Editar Dados
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={isLoading}
                          >
                            Salvar Alterações
                          </Button>
                        </>
                      )}
                    </Flex>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProfilePage;