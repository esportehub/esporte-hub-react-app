import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Divider,
  CircularProgress,
  useToast,
  IconButton,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  middleName?: string;
  email: string;
  document?: string;
  phone?: string;
  gender?: string;
}

interface Tournament {
  id: string;
  name: string;
}

const TournamentRegistrationPage: React.FC = () => {
  const router = useRouter();
  const { tournamentId } = router.query;
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<StandardFormErrors>({});
  const [shirtSize, setShirtSize] = useState('M');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        // Fetch user data
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = userResponse.data;
        setUser(userData);
        
        // Fetch tournament data
        const tournamentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/beach-tennis/tournaments/${tournamentId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setTournament(tournamentResponse.data);
        
        // Set form data
        setFormData({
          name: `${userData.name} ${userData.middleName || ''}`.trim(),
          email: userData.email || '',
          document: userData.document || '',
          phone: userData.phone || '',
        });
        
        setGender(userData.gender || '');
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
        
        toast({
          title: 'Erro',
          description: 'Falha ao carregar dados do usuário ou torneio',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    if (tournamentId) {
      fetchData();
    }
  }, [tournamentId, toast]);

  const validateForm = (): boolean => {
    const newErrors: StandardFormErrors = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.document) {
      newErrors.document = 'CPF é obrigatório';
    } else if (!cpfValidator.isValid(formData.document)) {
      newErrors.document = 'CPF inválido';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length !== 11) {
      newErrors.phone = 'Telefone deve ter 11 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const formatCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setFormData(prev => ({ ...prev, phone: cleaned }));
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setFormData(prev => ({ ...prev, document: cleaned }));
    }
  };

  const updateUserInfo = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/update-documents`,
        {
          document: formData.document,
          phone: formData.phone,
          gender: gender
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Error updating user info:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user || !tournamentId) return;

    try {
      setLoading(true);
      
      // Check if user needs to update info
      const needsUpdate = !user.document || !user.phone || !user.gender;
      
      if (needsUpdate) {
        const updateSuccess = await updateUserInfo(user.id);
        if (!updateSuccess) {
          throw new Error('Falha ao atualizar informações do usuário');
        }
        
        toast({
          title: 'Sucesso',
          description: 'Informações atualizadas com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Redirect to category selection page
      router.push({
        pathname: `/tournament/${tournamentId}/categories`,
        query: {
          shirtSize,
          userGender: gender,
          userId: user.id
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <CircularProgress isIndeterminate />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button onClick={() => router.back()}>Voltar</Button>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Flex
        as="header"
        align="center"
        p={4}
        bg="white"
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <IconButton
          aria-label="Voltar"
          icon={<ArrowBackIcon />}
          mr={4}
          onClick={() => router.back()}
        />
        <Heading size="md" flexGrow={1}>
          {tournament?.name || 'Inscrição de torneio'}
        </Heading>
      </Flex>

      <Box maxW="container.md" mx="auto" p={6}>
        <Text mb={4}>
          Preencha e verifique os campos corretamente para inscrever-se neste torneio.
        </Text>
        <Heading as="h1" size="lg" mb={6}>
          Formulário de inscrição
        </Heading>

        <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="md" boxShadow="sm">
          {/* Name Field */}
          <FormControl isInvalid={!!errors.name} mb={4}>
            <FormLabel>Nome do Atleta</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              isReadOnly
            />
            {errors.name && <Text color="red.500">{errors.name}</Text>}
          </FormControl>

          {/* Email Field */}
          <FormControl isInvalid={!!errors.email} mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              isReadOnly
            />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
          </FormControl>

          {/* CPF Field */}
          <FormControl isInvalid={!!errors.document} mb={4}>
            <FormLabel>Número do CPF</FormLabel>
            <Input
              name="document"
              value={formatCPF(formData.document)}
              onChange={handleCPFChange}
              isReadOnly={!!user?.document}
            />
            {errors.document && <Text color="red.500">{errors.document}</Text>}
          </FormControl>

          {/* Phone Field */}
          <FormControl isInvalid={!!errors.phone} mb={4}>
            <FormLabel>Telefone</FormLabel>
            <Input
              name="phone"
              value={formatPhone(formData.phone)}
              onChange={handlePhoneChange}
              isReadOnly={!!user?.phone}
            />
            {errors.phone && <Text color="red.500">{errors.phone}</Text>}
          </FormControl>

          {/* Gender Field */}
          <FormControl isRequired mb={4}>
            <FormLabel>Gênero</FormLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Selecione o gênero"
              isDisabled={!!user?.gender}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Select>
          </FormControl>

          <Divider my={6} />

          {/* Shirt Size Field */}
          <FormControl mb={6}>
            <FormLabel>Tamanho da Camiseta</FormLabel>
            <Select
              value={shirtSize}
              onChange={(e) => setShirtSize(e.target.value)}
            >
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </Select>
          </FormControl>

          <Button
            type="submit"
            width="full"
            colorScheme="blue"
            size="lg"
            mt={4}
            isLoading={loading}
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TournamentRegistrationPage;