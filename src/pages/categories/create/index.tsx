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
  IconButton,
  Flex,
  Grid,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid,
  Image,
  useRadioGroup,
  useRadio,
  Card,
  CardBody
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import Layout from '@/components/Layout';

interface FormData {
  name: string;
  disputeModel: string;
  maxRegistrations: string;
  gameType: string;
  sets: string;
  games: string;
  gender: string;
  level: string;
  minAge: number;
  maxAge: number;
}

const genderOptions = [
  {
    value: 'Masculino',
    label: 'Masculino',
    image: 'https://blog.rankingdetenis.com/wp-content/webpc-passthru.php?src=https://blog.rankingdetenis.com/wp-content/uploads/2021/12/michele-cappelleti.jpg&nocache=1'
  },
  {
    value: 'Feminino',
    label: 'Feminino',
    image: 'https://s2-ge.glbimg.com/E_Z3u7OE2ymiSgMCSnZEPkJohVQ=/0x0:1080x992/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/q/T/Q2DLqDRsijwTBqPrAKkg/whatsapp-image-2022-03-03-at-18.47.04.jpeg'
  },
  {
    value: 'Mista',
    label: 'Mista',
    image: 'https://cdn.progresso.com.br/img/pc/780/530/dn_arquivo/2021/11/foto-beach-tennis-credito-trackefield-1.jpg'
  }
];

const levelOptions = ['A', 'B', 'C', 'D'];

const CategoryCreationPage = () => {
  const router = useRouter();
  //const { tournamentId } = router.query;
  const [tournamentId, setTournamentId] = useState('');
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdCategoryId, setCreatedCategoryId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    disputeModel: '',
    maxRegistrations: '',
    gameType: '',
    sets: '',
    games: '',
    gender: '',
    level: '',
    minAge: 15,
    maxAge: 20
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgeChange = (name: 'minAge' | 'maxAge', value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (categoryId: number) => {
    if (!selectedImage) return false;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const token = localStorage.getItem('authToken');
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${categoryId}/image/category`,
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
    setTournamentId('VDvxilvzLOKXVR5Ek6rk');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

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
        min_age: formData.minAge,
        max_age: formData.maxAge
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments/categories`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        const categoryId = response.data.id;
        setCreatedCategoryId(categoryId);
        
        if (selectedImage) {
          await uploadImage(categoryId);
        }

        setIsSuccessModalOpen(true);
      } else {
        throw new Error(response.data.message || 'Erro ao criar categoria');
      }
    } catch (error: any) {
      console.error('Error creating category:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Erro desconhecido');
      setIsErrorModalOpen(true);
      
      toast({
        title: 'Erro',
        description: error.response?.data?.message || error.message || 'Erro ao criar categoria',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom radio button component for gender selection
  const GenderRadioCard = (props: any) => {
    const { getInputProps, getRadioProps } = useRadio(props);
    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
      <Box as="label">
        <input {...input} />
        <Card
          {...checkbox}
          cursor="pointer"
          borderWidth="2px"
          borderRadius="md"
          borderColor="gray.200"
          _checked={{
            borderColor: 'blue.500',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          overflow="hidden"
        >
          <Image 
            src={props.image} 
            alt={props.children} 
            objectFit="cover"
            h="120px"
            w="100%"
          />
          <CardBody p={2}>
            <Text fontWeight="bold" textAlign="center">{props.children}</Text>
          </CardBody>
        </Card>
      </Box>
    );
  };

  // Custom radio button component for level selection
  const LevelRadioCard = (props: any) => {
    const { getInputProps, getRadioProps } = useRadio(props);
    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="2px"
          borderRadius="md"
          borderColor="gray.200"
          _checked={{
            borderColor: 'blue.500',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          px={5}
          py={3}
        >
          <Text fontWeight="bold" textAlign="center">{props.children}</Text>
        </Box>
      </Box>
    );
  };

  const { getRootProps: getGenderRootProps, getRadioProps: getGenderRadioProps } = useRadioGroup({
    name: 'gender',
    onChange: (value) => setFormData(prev => ({ ...prev, gender: value }))
  });

  const { getRootProps: getLevelRootProps, getRadioProps: getLevelRadioProps } = useRadioGroup({
    name: 'level',
    onChange: (value) => setFormData(prev => ({ ...prev, level: value }))
  });

  const genderGroup = getGenderRootProps();
  const levelGroup = getLevelRootProps();

  return (
    <Layout>
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
              src={previewImage || undefined}
              borderRadius="md"
              size="xl"
              icon={!previewImage ? <FaCamera /> : undefined}
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
          {previewImage && (
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
              placeholder="Ex: Categoria Sub-20"
            />
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Máximo de Registros</FormLabel>
            <Input
              name="maxRegistrations"
              type="number"
              value={formData.maxRegistrations}
              onChange={handleChange}
              placeholder="Ex: 16"
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
            <FormLabel>Quantidade de Games por Set</FormLabel>
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

          {/* Gender Selection */}
          <FormControl isRequired mb={6}>
            <FormLabel>Gênero da Categoria</FormLabel>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} {...genderGroup}>
              {genderOptions.map((option) => {
                const radio = getGenderRadioProps({ value: option.value });
                return (
                  <GenderRadioCard key={option.value} {...radio} image={option.image}>
                    {option.label}
                  </GenderRadioCard>
                );
              })}
            </SimpleGrid>
          </FormControl>

          {/* Level Selection */}
          <FormControl isRequired mb={6}>
            <FormLabel>Nível da Categoria</FormLabel>
            <Flex {...levelGroup} gap={2} wrap="wrap">
              {levelOptions.map((value) => {
                const radio = getLevelRadioProps({ value });
                return (
                  <LevelRadioCard key={value} {...radio}>
                    {value}
                  </LevelRadioCard>
                );
              })}
            </Flex>
          </FormControl>

          <Divider my={6} />

          {/* Age Restrictions */}
          <Heading as="h3" size="md" mb={4}>
            Restrições de Idade
          </Heading>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={6}>
            <FormControl>
              <FormLabel>Idade Mínima: {formData.minAge} anos</FormLabel>
              <Slider
                aria-label="Idade mínima"
                defaultValue={15}
                min={0}
                max={100}
                step={1}
                value={formData.minAge}
                onChange={(val) => handleAgeChange('minAge', val)}
                mb={4}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel>Idade Máxima: {formData.maxAge} anos</FormLabel>
              <Slider
                aria-label="Idade máxima"
                defaultValue={20}
                min={0}
                max={100}
                step={1}
                value={formData.maxAge}
                onChange={(val) => handleAgeChange('maxAge', val)}
                mb={4}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Flex justify="center" mt={8}>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Criando categoria, aguarde..."
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
                  router.push(`/tournaments/${tournamentId}`);
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
    </Layout>
  );
};

export default CategoryCreationPage;