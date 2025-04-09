import React from "react"
import { Stack, Input, Button, Box, Heading } from "@chakra-ui/react"
import { Field } from "@chakra-ui/react"
import { PasswordInput } from "../components/ui/password-input"
import { Image } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"
import logo from "../assets/images/esporte-hub-logo.png"
import { Link as RouterLink } from "react-router-dom";

const Login = () => {

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
                    src={logo}
                    boxSize="150px"
                    margin="auto"
                    borderRadius="full"
                    fit="cover"
                    alt="Esporte Hub"
                />
                <Heading mb={6} size="lg" textAlign="center" margin="20px 0">
                    Faça seu Login
                </Heading>
                <form>
                    <Stack spacing={4}>
                        <Field.Root>
                            <Field.Label>Email</Field.Label>
                            <Input type="email" placeholder="Digite seu email" />
                            <Field.ErrorText>erro</Field.ErrorText>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Senha</Field.Label>
                            <PasswordInput placeholder="Digite sua senha" />
                            <Field.ErrorText>erro</Field.ErrorText>
                        </Field.Root>

                        <Button type="submit" colorScheme="teal" width="full">
                            Acessar
                        </Button>

                        <Text fontSize="sm"
                               textAlign="center">
                            Ou acesse com sua rede social: 
                        
                        </Text>
                    </Stack>
                </form>

                <Heading size="sm" textAlign="center" margin="20px 0">
                    Ainda não tem uma conta?{" "}
                    <Link as={RouterLink} to="/register" color="green" variant="underline">
                        Cadastrar!
                    </Link>
                </Heading>
            </Box>
        </Box>
    )
}

export default Login
