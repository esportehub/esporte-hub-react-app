import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import axios from 'axios';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

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
  // Add other tournament properties as needed
}

interface FormData {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
}

const TournamentRegistrationPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    document: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [shirtSize, setShirtSize] = useState('M');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockUser: User = {
          id: '1',
          name: 'John',
          middleName: 'Doe',
          email: 'john.doe@example.com',
          document: '',
          phone: '',
          gender: ''
        };
        
        const mockTournament: Tournament = {
          id: tournamentId || '1'
        };
        
        setUser(mockUser);
        setTournament(mockTournament);
        
        setFormData({
          name: `${mockUser.name} ${mockUser.middleName || ''}`.trim(),
          email: mockUser.email || '',
          document: mockUser.document || '',
          phone: mockUser.phone || '',
        });
        
        setGender(mockUser.gender || '');
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tournamentId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    try {
      const needsUpdate = !user.document || !user.phone || !user.gender;
      
      if (needsUpdate) {
        // In a real app, you would make an API call here
        /*
        await axios.patch(
          `/users/${user.id}/update-documents`,
          {
            document: formData.document,
            phone: formData.phone,
            gender: gender
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        */
      }
      
      navigate(`/tournament/${tournamentId}/categories`, {
        state: {
          shirtSize,
          userGender: gender,
          user: {
            ...user,
            document: formData.document,
            phone: formData.phone,
            gender
          }
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
    }
  };

  if (loading) {
    return (
      <Flex justify="center" mt={8}>
        <CircularProgress isIndeterminate />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
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
          onClick={() => navigate(-1)}
        />
        <Heading size="md" flexGrow={1}>
          Inscrição de torneio
        </Heading>
      </Flex>

      <Box p={6}>
        <Text mb={4}>
          Preencha e verifique os campos corretamente para inscrever-se neste torneio.
        </Text>
        <Heading as="h1" size="lg" mb={6}>
          Formulário de inscrição
        </Heading>

        <Box as="form" onSubmit={handleSubmit}>
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
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TournamentRegistrationPage;