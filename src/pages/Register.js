import React from "react"
import { Stack, Input, Button, Box, Heading } from "@chakra-ui/react"
import { Field } from "@chakra-ui/react"
import { PasswordInput } from "../components/ui/password-input"
import { PasswordStrengthMeter } from "../components/ui/password-input"
import { Image } from "@chakra-ui/react"
import logo from "../assets/images/esporte-hub-logo.png"
import { Link } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom";

const Register = () => {
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
                    Cadastre-se
                </Heading>
                <form>
                    <Stack spacing={4}>
                        <Field.Root>
                            <Field.Label>Nome</Field.Label>
                            <Input type="text" placeholder="Seu primeiro nome" />
                            <Field.ErrorText>erro</Field.ErrorText>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Sobrenome</Field.Label>
                            <Input type="text" placeholder="Seu sobrenome" />
                            <Field.ErrorText>erro</Field.ErrorText>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Email</Field.Label>
                            <Input type="email" placeholder="Digite seu email" />
                            <Field.ErrorText>erro</Field.ErrorText>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Senha</Field.Label>
                            <PasswordInput />
                            <PasswordStrengthMeter value={2} />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Repita sua senha</Field.Label>
                            <PasswordInput /> 
                        </Field.Root>

                        <Button type="submit" colorScheme="teal" width="full">
                            Cadastrar
                        </Button>
                    </Stack>
                </form>

                <Heading size="sm" textAlign="center" margin="20px 0">
                    Já tem uma conta?{" "}
                    <Link as={RouterLink} to="/login" color="green" variant="underline">
                        Fazer login!
                    </Link>
                </Heading>

            </Box>
        </Box>
    )
}

export default Register;
