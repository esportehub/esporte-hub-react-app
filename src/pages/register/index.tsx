import React, { useState } from 'react';
import { 
  Box,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Text,
  Image,
  Link,
  Progress,
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import LinkNext from 'next/link';
import logo from "../../../src/assets/esporte-hub-logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    // Simples cálculo de força da senha (substitua por um mais robusto)
    setPasswordScore(Math.min(Math.floor(value.length / 3), 4));
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
      <Box
        maxW="md"
        w="full"
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
      >
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
        
        <form>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input type="text" placeholder="Seu primeiro nome" />
              <FormErrorMessage>Erro no nome</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Sobrenome</FormLabel>
              <Input type="text" placeholder="Seu sobrenome" />
              <FormErrorMessage>Erro no sobrenome</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Digite seu email" />
              <FormErrorMessage>Erro no email</FormErrorMessage>
            </FormControl>

            <FormControl>
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

            <FormControl>
              <FormLabel>Repita sua senha</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
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
              <FormErrorMessage>As senhas não coincidem</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full" mt={4}>
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