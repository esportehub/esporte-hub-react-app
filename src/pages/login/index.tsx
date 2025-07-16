import React, { useState } from 'react';
import {
  Box, Input, Button, Heading, Text, IconButton,
  InputGroup, InputRightElement, Container, Link,
  useToast, Stack, Center,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { FaGoogle, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import logo from "../../../src/assets/esporte-hub-logo.png";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { initFirebase } from '@/firebase/firebase'; // ajuste o caminho se estiver diferente
import { NextPageWithAuth } from 'next';

const LoginPage: NextPageWithAuth =  () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const { auth } = initFirebase();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token);
      toast({
        title: 'Autenticado com sucesso!',
        status: 'success',
        duration: 5000,
        position: 'top',    
        isClosable: true,
      });
      router.push('/home');
    } catch (error: any) {
      toast({
        title: 'Falha ao autenticar',
        description: error.message || 'Erro desconhecido',
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      bgGradient="linear(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="container.sm">
        <Box bg="white" borderRadius="md" boxShadow="xl" overflow="hidden" mb={6}>
          <Box bg="primary.500" py={8} px={6} display="flex" justifyContent="center">
            <Image
              src={logo.src}
              alt="Logo"
              width={200}
              height={120}
              style={{
                maxWidth: '100%',
                borderRadius: '10px',
                objectFit: 'contain'
              }}
            />
          </Box>
        </Box>

        <Box bg="white" borderRadius="md" boxShadow="xl" p={8}>
          <Heading as="h1" size="xl" mb={4} color="gray.800" fontWeight="bold">
            Bora pro jogo?
          </Heading>
          <Text color="gray.600" mb={6}>
            Faça login para continuar
          </Text>

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={4}
            size="lg"
          />

          <InputGroup mb={4}>
            <Input
              placeholder="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
            />
            <InputRightElement h="full">
              <IconButton
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>

          <Box textAlign="right" mb={6}>
            <Link
              onClick={() => router.push('/login/forgot-password')}
              color="blue.500"
              fontSize="sm"
            >
              Esqueci minha senha
            </Link>
          </Box>

          <Button
            width="full"
            colorScheme="blue"
            size="lg"
            onClick={handleLogin}
            isLoading={isLoading}
            loadingText="Entrando..."
            mb={6}
          >
            Entrar
          </Button>

          <Text textAlign="center" color="gray.600" mb={4}>
            Ou entre com sua rede social:
          </Text>

          <Center mb={6}>
            <Stack direction="row" spacing={4}>
              <IconButton aria-label="Login com Google" icon={<FaGoogle />} colorScheme="red" variant="outline" />
              <IconButton aria-label="Login com Facebook" icon={<FaFacebook />} colorScheme="facebook" variant="outline" />
              <IconButton aria-label="Login com Twitter" icon={<FaTwitter />} colorScheme="twitter" variant="outline" />
              <IconButton aria-label="Login com Instagram" icon={<FaInstagram />} colorScheme="pink" variant="outline" />
            </Stack>
          </Center>

          <Text textAlign="center" color="gray.800">
            Ainda não tem cadastro?{' '}
            <Link href="/register" color="blue.500" fontWeight="semibold">
              Cadastrar
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

LoginPage.authRequired = false;
export default LoginPage;
