import React, { useState } from 'react';
import {
  Box, Stack, Input, InputGroup, InputRightElement, Button, Heading,
  Text, Image, Link, Progress, FormControl, FormLabel,
  FormErrorMessage, IconButton, useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import LinkNext from 'next/link';
import logo from "../../../src/assets/esporte-hub-logo.png";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';
import { initFirebase } from '@/firebase/firebase';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { auth } = initFirebase();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordScore(Math.min(Math.floor(value.length / 3), 4));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      toast({
        title: 'Conta criada!',
        description: 'Você foi cadastrado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/home'); // ou /login
    } catch (error: any) {
      toast({
        title: 'Erro ao cadastrar',
        description: error.message || 'Erro desconhecido',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      w="full"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <Box maxW="md" w="full" bg="white" p={8} borderRadius="md" boxShadow="md">
        <Image
          src={logo.src}
          boxSize="150px"
          margin="auto"
          borderRadius="full"
          objectFit="cover"
          alt="Esporte Hub"
        />

        <Heading mb={6} size="lg" textAlign="center" my={5}>
          Cadastre-se
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                type="text"
                placeholder="Seu primeiro nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Sobrenome</FormLabel>
              <Input
                type="text"
                placeholder="Seu sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie uma senha"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <Progress
                value={passwordScore * 25}
                size="xs"
                colorScheme={passwordScore > 2 ? 'green' : 'red'}
                mt={2}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Força da senha: {['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'][passwordScore]}
              </Text>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Repita sua senha</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              mt={4}
              isLoading={isSubmitting}
              loadingText="Cadastrando..."
            >
              Cadastrar
            </Button>
          </Stack>
        </form>

        <Text textAlign="center" mt={5}>
          Já tem uma conta?{' '}
          <Link as={LinkNext} href="/login" color="teal.500" fontWeight="semibold">
            Fazer login!
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;
