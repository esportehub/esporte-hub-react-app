import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
  Heading,
  Flex,
  IconButton,
  Tag,
  TagLabel,
  Card,
  CardBody,
  Stack,
  Spinner,
  Text,
  useToast
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  middleName: string;
  document: string;
  email: string;
  phone: string;
  birthday: string | null;
  about: string;
  gender: string;
}

interface FormData {
  name: string;
  middleName: string;
  document: string;
  email: string;
  phone: string;
  birthday: Date | null;
  about: string;
  gender: string;
}

const DadosPessoais: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    middleName: '',
    document: '',
    email: '',
    phone: '',
    birthday: null,
    about: '',
    gender: ''
  });
  const genderOptions = ['Feminino', 'Masculino'];

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const inputBgColor = useColorModeValue('white', 'gray.800');
  const disabledBgColor = useColorModeValue('gray.100', 'gray.600');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/me/profile`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setFormData({
            name: userData.name || '',
            middleName: userData.middleName || '',
            document: userData.document || '',
            email: userData.email || '',
            phone: userData.phone || '',
            birthday: userData.birthday ? parse(userData.birthday, 'yyyy-MM-dd', new Date()) : null,
            about: userData.about || '',
            gender: userData.gender || ''
          });
        } else {
          throw new Error('Failed to load user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Erro ao carregar dados do usuário',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [toast]);

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

    try {
      const token = localStorage.getItem('authToken');
      const formattedDate = formData.birthday ? format(formData.birthday, 'yyyy-MM-dd') : null;

      const response = await fetch(`${process.env.REACT_APP_API_DEV_BASE_URL}/users/${user?.id}/update-user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          about: formData.about,
          document: formData.document,
          birthday: formattedDate
        })
      });

      if (response.ok) {
        toast({
          title: 'Informações atualizadas com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/me/profile');
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      toast({
        title: 'Erro ao atualizar dados do usuário',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Text fontSize="xl">Erro ao carregar dados do usuário</Text>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bg={bgColor}>
      <Flex
        as="header"
        align="center"
        p={4}
        bg={inputBgColor}
        boxShadow="sm"
      >
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Voltar"
          onClick={() =>  router.back}
          variant="ghost"
          mr={2}
        />
        <Heading size="md">Meus dados pessoais</Heading>
      </Flex>

      <Container maxW="container.md" py={6} flex={1}>
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
                    isReadOnly={!!formData.name}
                    bg={formData.name ? disabledBgColor : inputBgColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Sobrenome</FormLabel>
                  <Input
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    isReadOnly={!!formData.middleName}
                    bg={formData.middleName ? disabledBgColor : inputBgColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Email</FormLabel>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    bg={formData.email ? disabledBgColor : inputBgColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Documento CPF</FormLabel>
                  <Input
                    name="document"
                    value={formData.document}
                    onChange={handleChange}
                    isReadOnly={!!formData.document}
                    bg={formData.document ? disabledBgColor : inputBgColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Telefone WhatsApp</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    bg={formData.phone ? disabledBgColor : inputBgColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Data de Nascimento</FormLabel>
                  <Box
                    bg={formData.birthday ? disabledBgColor : inputBgColor}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    p={1}
                  >
                    <DatePicker
                      selected={formData.birthday}
                      onChange={handleDateChange}
                      disabled={!!formData.birthday}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      customInput={
                        <Input
                          isReadOnly

                          value={formData.birthday ? format(formData.birthday, 'dd/MM/yyyy') : ''}
                        />
                      }
                    />
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Sobre você, {user.name}</FormLabel>
                  <Textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Esportes que pratica, seus pontos fortes, disponibilidade, etc."
                    rows={5}
                    bg={formData.about ? disabledBgColor : inputBgColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Gênero</FormLabel>
                  {user.gender ? (
                    <Tag size="lg" colorScheme="blue" borderRadius="full">
                      <TagLabel>{user.gender}</TagLabel>
                    </Tag>
                  ) : (
                    <Stack direction="row" spacing={2}>
                      {genderOptions.map((option) => (
                        <Tag
                          key={option}
                          size="lg"
                          cursor="pointer"
                          onClick={() => handleGenderChange(option)}
                          colorScheme={formData.gender === option ? 'blue' : 'gray'}
                          variant={formData.gender === option ? 'solid' : 'outline'}
                        >
                          <TagLabel>{option}</TagLabel>
                        </Tag>
                      ))}
                    </Stack>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  mt={6}
                  isLoading={loading}
                >
                  Atualizar dados
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default DadosPessoais;