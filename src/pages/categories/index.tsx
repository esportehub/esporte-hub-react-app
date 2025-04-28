import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Input,
  FormControl,
  FormLabel,
  Select,
  Avatar,
  Divider,
  Text,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CircularProgress,
  IconButton,
  Flex,
  Grid,
  useToast
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { FaCamera } from 'react-icons/fa';

interface FormData {
  name: string;
  disputeModel: string;
  maxRegistrations: string;
  gameType: string;
  sets: string;
  games: string;
  gender: string;
  level: string;
  minAge: string;
  maxAge: string;
}

const CategoryCreationPage = () => {
  const router = useRouter();
  const { tournamentId } = router.query;
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    disputeModel: '',
    maxRegistrations: '',
    gameType: '',
    sets: '',
    games: '',
    gender: '',
    level: '',
    minAge: '1',
    maxAge: '99'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestBody = {
        tournament_id: tournamentId,
        name: formData.name,
        dispute_model: formData.disputeModel,
        max_registrations: parseInt(formData.maxRegistrations) || 0,
        game_type: formData.gameType,
        sets: parseInt(formData.sets) || 0,
        games: parseInt(formData.games) || 0,
        gender: formData.gender,
        category: formData.level,
        min_age: parseInt(formData.minAge) || 0,
        max_age: parseInt(formData.maxAge) || 0
      };

      console.log('Submitting:', requestBody);
      setIsSuccessModalOpen(true);

    } catch (error: any) {
      console.error('Error creating category:', error);
      setErrorMessage(error.message || 'Failed to create category');
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      {/* Header */}
      <Flex align="center" mb={8}>
        <IconButton 
          aria-label="Voltar"
          icon={<ChevronLeftIcon />}
          onClick={() => router.back()}
          mr={4}
        />
        <Heading as="h1" size="xl">
          Cadastrar Categoria
        </Heading>
      </Flex>

      {/* Category Image */}
      <Box mb={8}>
        <Heading as="h2" size="md" mb={4}>
          Escolha uma imagem para sua categoria
        </Heading>
        <Flex align="center" gap={4}>
          <Avatar
            src={selectedImage || undefined}
            borderRadius="md"
            size="xl"
            icon={!selectedImage ? <FaCamera /> : undefined}
          />
          <Button
            as="label"
            leftIcon={<FaCamera />}
            variant="solid"
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
        {selectedImage && (
          <Text fontSize="sm" mt={2} color="gray.500">
            Imagem selecionada
          </Text>
        )}
      </Box>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="lg" mb={4}>
          Informações da Categoria
        </Heading>
        <Divider mb={6} />

        <FormControl isRequired mb={4}>
          <FormLabel>Nome da Categoria</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite o nome da categoria"
          />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Máximo de Registros</FormLabel>
          <Input
            name="maxRegistrations"
            type="number"
            value={formData.maxRegistrations}
            onChange={handleChange}
            placeholder="Digite o máximo de inscrições"
          />
        </FormControl>

        {/* Dispute Model */}
        <FormControl isRequired mb={4}>
          <FormLabel>Modalidade</FormLabel>
          <Select
            name="disputeModel"
            value={formData.disputeModel}
            onChange={handleChange}
            placeholder="Selecione a modalidade"
          >
            <option value="Eliminatório">Eliminatório</option>
            <option value="Todos contra todos">Todos contra todos</option>
          </Select>
        </FormControl>

        {/* Game Type */}
        <FormControl isRequired mb={4}>
          <FormLabel>Estilo de Jogo</FormLabel>
          <Select
            name="gameType"
            value={formData.gameType}
            onChange={handleChange}
            placeholder="Selecione o estilo de jogo"
          >
            <option value="Simples">Simples</option>
            <option value="Duplas">Duplas</option>
          </Select>
        </FormControl>

        {/* Sets */}
        <FormControl isRequired mb={4}>
          <FormLabel>Quantidade de Sets</FormLabel>
          <Select
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            placeholder="Selecione a quantidade de sets"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num.toString()}>{num}</option>
            ))}
          </Select>
        </FormControl>

        {/* Games */}
        <FormControl isRequired mb={4}>
          <FormLabel>Quantidade de Games</FormLabel>
          <Select
            name="games"
            value={formData.games}
            onChange={handleChange}
            placeholder="Selecione a quantidade de games"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num.toString()}>{num}</option>
            ))}
          </Select>
        </FormControl>

        {/* Gender */}
        <FormControl isRequired mb={4}>
          <FormLabel>Gênero da Categoria</FormLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Selecione o gênero"
          >
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Mista">Mista</option>
          </Select>
        </FormControl>

        {/* Level */}
        <FormControl isRequired mb={4}>
          <FormLabel>Nível da Categoria</FormLabel>
          <Select
            name="level"
            value={formData.level}
            onChange={handleChange}
            placeholder="Selecione o nível"
          >
            {['A', 'B', 'C', 'D'].map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </Select>
        </FormControl>

        <Divider my={6} />

        {/* Age Restrictions */}
        <Heading as="h3" size="md" mb={4}>
          Restrições de Idade
        </Heading>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mb={6}>
          <FormControl>
            <FormLabel>Idade Mínima</FormLabel>
            <Input
              name="minAge"
              type="number"
              value={formData.minAge}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Idade Máxima</FormLabel>
            <Input
              name="maxAge"
              type="number"
              value={formData.maxAge}
              onChange={handleChange}
            />
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Flex justify="center" mt={8}>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={loading}
            loadingText="Enviando..."
            px={12}
            py={6}
            borderRadius="full"
          >
            Finalizar Cadastro
          </Button>
        </Flex>
      </Box>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Categoria criada com sucesso!</ModalHeader>
          <ModalBody textAlign="center">
            <Text>Sua categoria foi criada e está pronta para receber inscrições.</Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="blue"
              onClick={() => {
                setIsSuccessModalOpen(false);
                router.push(`/tournament/${tournamentId}`);
              }}
            >
              Voltar para o Torneio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Error Modal */}
      <Modal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Erro ao criar categoria</ModalHeader>
          <ModalBody textAlign="center">
            <Text>{errorMessage}</Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              variant="outline"
              onClick={() => setIsErrorModalOpen(false)}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CategoryCreationPage;