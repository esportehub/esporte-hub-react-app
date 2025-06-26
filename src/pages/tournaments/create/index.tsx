import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  Textarea,
  Text,
  IconButton,
  Avatar,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Stack,
  Grid,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Flex,
  Heading,
  useToast,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CheckCircleIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { format } from 'date-fns';
import { FaCamera } from 'react-icons/fa';
import { useRouter } from 'next/router';
import DateInput from '../../../components/DateInput'
import Layout from '@/components/Layout';
import axios from 'axios';
import { useAuth } from '@/hooks/auth/useAuth';
import { CreateTournamentInterface } from '@/form-data/tournaments/CreateTournamentInterface';

const TournamentCreationPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { decodedToken, appUser, loadingAuth, errorAuth } = useAuth();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();

  const [errorMessage, setErrorMessage] = useState('');
  const [createdTournamentId, setCreatedTournamentId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateTournamentInterface>({
    eventName: '',
    playerInfo: '',
    registrationStart: null,
    registrationEnd: null,
    tournamentStart: null,
    tournamentEnd: null,
    eligiblePlayers: '',
    maxCategoriesPerPlayer: 0,
    paymentMethod: 'Pix',
    prizeValue: '',
    registrationFeeType: '',
    registrationFee1: 0,
    registrationFee2: 0,
    registrationFee3: 0,
    registrationFee4: 0,
    paymentDeadline: '',
    tournamentLocation: '',
    teamId: '',
    contactEmail: '',
    contactPhone: '',
    scoreReporter: '',
    waitlistInfo: '',
    preRegistrationInfo: '',
    postRegistrationInfo: '',
    prizeDescription: '',
    tournamentRules: '',
  });

  useEffect(() => {
    if (decodedToken) {
      console.log('Usuário autenticado:', decodedToken.name, decodedToken.email);
    }
  }, [decodedToken]);

  // Modifique o handleChange para tratar números corretamente
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Tratamento especial para campos numéricos
    if (name === 'maxCategoriesPerPlayer' ||
      name === 'registrationFee1' ||
      name === 'registrationFee2' ||
      name === 'registrationFee3' ||
      name === 'registrationFee4') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name: keyof CreateTournamentInterface, date: Date | null) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);

      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
      }

      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (tournamentId: number) => {
    if (!selectedImageFile) return false;

    try {
      const formData = new FormData();
      formData.append('image', selectedImageFile);

      const token = localStorage.getItem('authToken');
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${tournamentId}/image/tournaments`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Error uploading image:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const formatDate = (date: Date | null) => date ? format(date, 'yyyy-MM-dd') : null;

      const requestBody = {
        eventName: formData.eventName,
        playerInfo: formData.playerInfo,
        registrationStart: formatDate(formData.registrationStart),
        registrationEnd: formatDate(formData.registrationEnd),
        tournamentStart: formatDate(formData.tournamentStart),
        tournamentEnd: formatDate(formData.tournamentEnd),
        eligiblePlayers: formData.eligiblePlayers,
        maxCategoriesPerPlayer: formData.maxCategoriesPerPlayer,
        paymentMethod: formData.paymentMethod,
        prizeValue: parseFloat(formData.prizeValue) || 0,
        registrationFeeType: formData.registrationFeeType,
        registrationFee1: formData.registrationFee1,
        registrationFee2: formData.registrationFee2 ? formData.registrationFee2 : 0,
        registrationFee3: formData.registrationFee3 ? formData.registrationFee3 : 0,
        registrationFee4: formData.registrationFee4 ? formData.registrationFee4 : 0,
        paymentDeadline: formData.paymentDeadline,
        tournamentLocation: formData.tournamentLocation,
        teamId: parseInt(formData.teamId) || 0,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        preRegistrationInfo: formData.preRegistrationInfo,
        postRegistrationInfo: formData.postRegistrationInfo,
        prizeDescription: formData.prizeDescription,
        tournamentRules: formData.tournamentRules,
        scoreReporter: formData.scoreReporter,
        waitlistInfo: formData.waitlistInfo
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        const tournamentId = response.data.id;
        setCreatedTournamentId(tournamentId);

        // Upload da imagem se existir
        if (selectedImageFile) {
          await uploadImage(tournamentId);
        }

        onSuccessOpen();
      } else {
        throw new Error(response.data.message || 'Erro ao criar torneio');
      }
    } catch (error: any) {
      console.error('Error creating tournament:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Erro desconhecido');
      onErrorOpen();

      toast({
        title: 'Erro',
        description: error.response?.data?.message || error.message || 'Erro ao criar torneio',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (

    <Layout>
      <Container maxW="container.md" py={8}>
        {/* Header */}
        <Flex align="center" mb={8}>
          <IconButton
            aria-label="Voltar"
            icon={<ArrowBackIcon />}
            mr={4}
            onClick={() => router.back()}
          />
          <Heading as="h1" size="xl">
            Criar Torneio
          </Heading>
        </Flex>

        {/* Tournament Image */}
        <Box mb={8}>
          <Heading as="h2" size="lg" mb={4}>
            Escolha uma imagem para seu torneio
          </Heading>
          <Flex align="center" gap={4}>
            <Avatar
              src={selectedImageUrl}
              size="xl"
              borderRadius="md"
              icon={<FaCamera />}
            />
            <Button
              as="label"
              leftIcon={<FaCamera />}
              colorScheme="blue"
              cursor="pointer"
            >
              Upload Imagem
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Flex>
          {selectedImageFile && (
            <Text fontSize="sm" mt={2}>
              Imagem selecionada
            </Text>
          )}
        </Box>

        {/* Form */}
        <Box as="form" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Heading as="h2" size="lg" mt={8} mb={4}>
            Informações Básicas
          </Heading>
          <Divider mb={6} />

          <FormControl isRequired mb={4}>
            <FormLabel>Nome do evento</FormLabel>
            <Input
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Informações e observações aos jogadores</FormLabel>
            <Textarea
              name="playerInfo"
              value={formData.playerInfo}
              onChange={handleChange}
              rows={4}
            />
          </FormControl>

          {/* Dates Section */}
          <Heading as="h3" size="md" mt={8} mb={4}>
            Datas Importantes
          </Heading>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mb={4}>
            <DateInput
              label="Início das inscrições"
              value={formData.registrationStart}

              onChange={(e: any) => handleDateChange('registrationStart', e.target.value)}
              dataMinima={new Date()}
            />

            <DateInput
              label="Fim das inscrições"
              value={formData.registrationEnd}
              onChange={(e: any) => handleDateChange('registrationEnd', e.target.value)}
            />

            <DateInput
              label="Início dos jogos"
              value={formData.tournamentStart}
              onChange={(e: any) => handleDateChange('tournamentStart', e.target.value)}
            />


            <DateInput
              label="Fim dos jogos"
              value={formData.tournamentEnd}
              onChange={(e: any) => handleDateChange('tournamentEnd', e.target.value)}
            />
          </Grid>

          {/* Registration Rules */}
          <Heading as="h2" size="lg" mt={8} mb={4}>
            Regras de Inscrição
          </Heading>
          <Divider mb={6} />

          <FormControl mb={4}>
            <FormLabel>Quem pode se inscrever no torneio?</FormLabel>
            <Select
              value={formData.eligiblePlayers}
              onChange={handleChange}
              name="eligiblePlayers"
            >
              <option value="Todos os jogadores">Todos os jogadores</option>
              <option value="Somente membros">Somente membros</option>
              <option value="Por convite">Por convite</option>
            </Select>
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Máximo de Categorias</FormLabel>
            <Input
              type="number"
              name="maxCategoriesPerPlayer"
              value={formData.maxCategoriesPerPlayer}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Formas de pagamento</FormLabel>
            <Select
              value={formData.paymentMethod}
              onChange={handleChange}
              name="paymentMethod"
            >
              <option value="Pix">Pix</option>
              <option value="Boleto">Boleto</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Todas">Todas</option>
              <option value="Fora da plataforma">Fora da plataforma</option>
            </Select>
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Regras para valor de inscrição</FormLabel>
            <Select
              value={formData.registrationFeeType}
              onChange={handleChange}
              name="registrationFeeType"
            >
              <option value="Fixo">Fixo</option>
              <option value="Variável">Variável de acordo com o número da inscrição</option>
            </Select>
          </FormControl>

          {formData.registrationFeeType === 'Variável' && (
            <>
              {[1, 2, 3, 4].map((feeNumber) => (
                <FormControl mb={4} key={feeNumber}>
                  <FormLabel>{feeNumber}ª Inscrição</FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      value={(formData as any)[`registrationFee${feeNumber}`] || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [`registrationFee${feeNumber}`]: Number(e.target.value),
                        }))
                      }
                    />
                    <InputRightElement pointerEvents="none" />
                  </InputGroup>
                </FormControl>
              ))}
            </>
          )}

          {formData.registrationFeeType === 'Fixo' && (
            <FormControl mb={4}>
              <FormLabel>Valor da inscrição</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  value={formData.registrationFee1 || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      registrationFee1: Number(e.target.value),
                    }))
                  }
                />
                <InputRightElement pointerEvents="none" />
              </InputGroup>
            </FormControl>
          )}


          <FormControl mb={4}>
            <FormLabel>Prazo máximo para pagamento de inscrição</FormLabel>
            <Select
              value={formData.paymentDeadline}
              onChange={handleChange}
              name="paymentDeadline"
            >
              <option value="1 dia">1 dia</option>
              <option value="2 dias">2 dias</option>
              <option value="3 dias">3 dias</option>
              <option value="7 dias">7 dias</option>
              <option value="Não se aplica">Não se aplica</option>
            </Select>
          </FormControl>

          {/* Additional Info */}
          <Heading as="h2" size="lg" mt={8} mb={4}>
            Mais informações sobre o evento
          </Heading>
          <Divider mb={6} />

          <FormControl isRequired mb={4}>
            <FormLabel>Local do Evento</FormLabel>
            <Input
              name="tournamentLocation"
              value={formData.tournamentLocation}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Team ID</FormLabel>
            <Input
              type="number"
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Email para contato</FormLabel>
            <Input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Telefone para contato</FormLabel>
            <Input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Informações de pré registro</FormLabel>
            <Textarea
              name="preRegistrationInfo"
              value={formData.preRegistrationInfo}
              onChange={handleChange}
              rows={4}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Informações de pós registro</FormLabel>
            <Textarea
              name="postRegistrationInfo"
              value={formData.postRegistrationInfo}
              onChange={handleChange}
              rows={4}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Descrição de Premiação</FormLabel>
            <Textarea
              name="prizeDescription"
              value={formData.prizeDescription}
              onChange={handleChange}
              rows={4}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Valor da Premiação</FormLabel>
            <InputGroup>
              <Input
                type="number"
                name="prizeValue"
                value={formData.prizeValue}
                onChange={handleChange}
              />
              <InputRightElement pointerEvents="none" />
            </InputGroup>
          </FormControl>

          <FormControl mb={8}>
            <FormLabel>Regras do torneio</FormLabel>
            <Textarea
              name="tournamentRules"
              value={formData.tournamentRules}
              onChange={handleChange}
              rows={4}

            />
          </FormControl>

          {/* Submit Button */}
          <Flex justify="center" mt={8}>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              px={12}
              py={6}
              borderRadius="full"
            >
              Finalizar inscrição
            </Button>
          </Flex>
        </Box>

        {/* Success Modal */}
        <Modal isOpen={isSuccessOpen} onClose={onSuccessClose} isCentered>
          <ModalOverlay />
          <ModalContent textAlign="center">
            <ModalHeader>
              <CheckCircleIcon boxSize={12} color="green.500" mb={4} />
              <Heading size="lg">Torneio criado com sucesso!</Heading>
            </ModalHeader>
            <ModalBody>
              <Text>Seu torneio foi criado e está pronto para receber inscrições.</Text>
            </ModalBody>
            <ModalFooter justifyContent="center" pb={8}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onSuccessClose();
                  if (createdTournamentId) {
                    router.push(`/tournament/${createdTournamentId}`);
                  } else {
                    router.back();
                  }
                }}
              >
                Ver Torneio
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Error Modal */}
        <Modal isOpen={isErrorOpen} onClose={onErrorClose} isCentered>
          <ModalOverlay />
          <ModalContent textAlign="center">
            <ModalHeader>
              <CloseIcon boxSize={12} color="red.500" mb={4} />
              <Heading size="lg">Erro ao criar torneio</Heading>
            </ModalHeader>
            <ModalBody>
              <Text>{errorMessage}</Text>
            </ModalBody>
            <ModalFooter justifyContent="center" pb={8}>
              <Button
                variant="outline"
                onClick={onErrorClose}
              >
                OK
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
};

export default TournamentCreationPage;