import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  Input,
  Text,
  Heading,
  useBreakpointValue,
  useToast,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async () => {
    if (!email) {
      toast({ status: 'error', description: 'Por favor, insira seu email' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ status: 'error', description: 'Por favor, insira um email válido' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/auth/forgot-password', { email });

      if (response.status === 200) {
        toast({ status: 'success', description: 'Email de recuperação enviado com sucesso!' });
        navigate('/login');
      } else {
        toast({ status: 'error', description: 'Erro ao enviar email de recuperação' });
      }
    } catch (error: any) {
      toast({
        status: 'error',
        description: error.response?.data?.message || 'Erro ao enviar email de recuperação'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Box bg={inputBg} px={4} py={3} boxShadow="sm">
        <Flex align="center">
          <IconButton
            aria-label="Voltar"
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            mr={4}
          />
          <Heading size="md">Esqueci minha senha</Heading>
        </Flex>
      </Box>

      <Container maxW="md" py={10} display="flex" flexDirection="column" alignItems="center">
        {!isMobile && (
          <Flex align="center" w="100%" mb={4} cursor="pointer" onClick={() => navigate(-1)}>
            <ArrowBackIcon mr={2} />
            <Text>Voltar</Text>
          </Flex>
        )}

        <Heading as="h1" size="lg" mb={4} alignSelf="flex-start" fontWeight="600">
          Esqueceu sua senha?
        </Heading>

        <Text mb={6} alignSelf="flex-start" color={textSecondary}>
          Não se preocupe! Iremos lhe enviar um e-mail com um link para redefinir sua senha, digite o e-mail associado à sua conta abaixo.
        </Text>

        <Input
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
          bg={inputBg}
          borderRadius="md"
        />

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSubmit}
          isLoading={loading}
          width={{ base: '100%', md: '270px' }}
          borderRadius="md"
          fontWeight="500"
        >
          Enviar link de recuperação
        </Button>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
