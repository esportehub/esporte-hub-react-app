import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  CheckboxGroup,
  Progress,
  Card,
  CardBody,
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Badge,
  useBreakpointValue,
  Container
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  SearchIcon,
  AddIcon,
  CheckIcon,
  CloseIcon,
  SettingsIcon,
  InfoIcon,
  TimeIcon,
  CalendarIcon,
  PhoneIcon
} from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaTrophy, FaInfoCircle, FaScroll } from 'react-icons/fa';
import { IoFilterOutline, IoPeopleOutline, IoShirtOutline } from 'react-icons/io5';
import axios from 'axios';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/auth/authContext';
import { NextPageWithAuth } from 'next';
import banner from '@/assets/tournament-banner.jpg';
import logo from '@/assets/logo-teste.jpg';

interface Category {
  id: string;
  name: string;
  status: string;
  gender: string;
  category: string;
  max_registrations: number;
  current_registrations: number;
  isSorted: boolean;
  dispute_model: string;
  game_type: string;
  min_age: number;
  max_age: number;
  createdAt: string;
  imageHash?: string;
}

interface Tournament {
  id: string;
  eventName: string;
  status: string;
  tournamentStart: string;
  tournamentEnd: string;
  registrationStart: string;
  registrationEnd: string;
  tournamentLocation: string;
  contactEmail: string;
  contactPhone: string;
  tournamentRules: string;
  waitlistInfo: string;
  imageHash?: string;
  createdByUid: string;
}

const TournamentView: NextPageWithAuth = () => {
  const router = useRouter();
  const { id } = router.query;
  const { appUser } = useAuth();
  const toast = useToast();

  // Estados do torneio
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtro
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Estados da modal
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isCategoryModalOpen, onOpen: onCategoryModalOpen, onClose: onCategoryModalClose } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Configurações responsivas
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  // Buscar dados do torneio
  const fetchTournament = useCallback(async (tournamentId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setTournament(response.data);
      setIsAdmin(response.data.createdByUid === appUser?.uid);

    } catch (err) {
      console.error('Error fetching tournament:', err);
      setError('Falha ao carregar detalhes do torneio');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o torneio',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [appUser?.uid, toast]);

  // Buscar categorias do torneio
  const fetchCategories = useCallback(async (tournamentId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments/${tournamentId}/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setCategories(response.data);
      setFilteredCategories(response.data); // Mostra todas as categorias inicialmente

    } catch (err) {
      console.error('Error fetching categories:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar categorias',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Efeito para carregar dados quando o ID muda
  useEffect(() => {
    if (id) {
      fetchTournament(id as string);
      fetchCategories(id as string);
    }
  }, [id, fetchTournament, fetchCategories]);

  // Funções auxiliares
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'green';
      case 'cancelado': return 'red';
      case 'concluido': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'cancelado': return 'Cancelado';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let result = categories;

    /*if (selectedStatuses.length > 0) {
      result = result.filter(cat => selectedStatuses.includes(cat.status));
    }

    if (selectedCategories.length > 0) {
      result = result.filter(cat => selectedCategories.includes(cat.category));
    }
    */

    if (searchQuery) {
      result = result.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    /*if (appUser?.gender) {
      result = result.filter(cat =>
        cat.gender === 'Mista' ||
        cat.gender.toLowerCase() === appUser.gender.toLowerCase()
      );
    }
    */

    setFilteredCategories(result);
    setIsFilterApplied(selectedStatuses.length > 0 || selectedCategories.length > 0 || searchQuery.length > 0);
  }, [categories, selectedStatuses, selectedCategories, searchQuery, appUser?.gender]);

  // Efeito para aplicar filtros quando mudam
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  

  // Modal de detalhes da categoria
  const openCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    onCategoryModalOpen();
  };

  // Componente de card de categoria
  const CategoryCard = ({ category }: { category: Category }) => {
    const progressValue = category.max_registrations > 0
      ? ((category.current_registrations || 0) / category.max_registrations) * 100
      : 0;

    return (
      <Card 
        border="1px solid"
        borderColor="gray.200"
        _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
        transition="all 0.2s"
      >
        <CardBody>
          <Stack spacing={4}>
            {/* Header com nome e status */}
            <Flex justify="space-between" align="center">
              <Heading size="md" noOfLines={1}>
                {category.name}
              </Heading>
              <Badge 
                colorScheme={getStatusColor(category.status)}
                px={2}
                py={1}
                borderRadius="md"
              >
                {getStatusText(category.status)}
              </Badge>
            </Flex>

            {/* Detalhes da categoria */}
            <Stack spacing={2}>
              <Flex align="center">
                <Box as={IoShirtOutline} mr={2} color="gray.500" />
                <Text fontSize="sm" color="gray.600">
                  {category.game_type === 'individual' ? 'Individual' : 'Duplas'} • {category.dispute_model}
                </Text>
              </Flex>

              <Flex align="center">
                <Box as={FaMapMarkerAlt} mr={2} color="gray.500" boxSize={3} />
                <Text fontSize="sm" color="gray.600">
                  {category.gender === 'masculino' ? 'Masculino' : 
                   category.gender === 'feminino' ? 'Feminino' : 'Misto'} • {category.category}
                </Text>
              </Flex>

              <Flex align="center">
                <Box as={CalendarIcon} mr={2} color="gray.500" boxSize={3} />
                <Text fontSize="sm" color="gray.600">
                  Idade: {category.min_age}-{category.max_age} anos
                </Text>
              </Flex>
            </Stack>

            {/* Progresso de inscrições */}
            <Box mt={4}>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="medium">
                  Vagas preenchidas
                </Text>
                <Text fontSize="sm" color="blue.600" fontWeight="bold">
                  {category.current_registrations || 0}/{category.max_registrations}
                </Text>
              </Flex>
              <Progress 
                value={progressValue} 
                size="sm" 
                colorScheme="blue" 
                borderRadius="full"
              />
            </Box>

            {/* Botões de ação */}
            <Flex mt={6} gap={2}>
              <Button
                flex={1}
                variant="outline"
                colorScheme="blue"
                size="sm"
                leftIcon={<IoPeopleOutline />}
                onClick={() => router.push(`/tournament/${id}/category/${category.id}/subscribers`)}
              >
                Inscritos
              </Button>
              
              <Button
                flex={1}
                colorScheme="blue"
                size="sm"
                leftIcon={<IoShirtOutline />}
                onClick={() => category.isSorted 
                  ? router.push(`/tournament/${id}/category/${category.id}/groups`)
                  : router.push(`/tournament/${id}/category/${category.id}/subscribers`)
                }
              >
                {category.isSorted ? 'Grupos' : 'Gerenciar'}
              </Button>
            </Flex>

            {/* Ações rápidas para admin */}
            {isAdmin && (
              <Flex mt={2} gap={2}>
                <Button
                  flex={1}
                  variant="ghost"
                  size="sm"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implementar lógica de exclusão
                  }}
                >
                  Excluir
                </Button>
                <Button
                  flex={1}
                  variant="ghost"
                  size="sm"
                  colorScheme="orange"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCategoryModal(category);
                  }}
                >
                  Editar
                </Button>
              </Flex>
            )}
          </Stack>
        </CardBody>
      </Card>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" thickness="4px" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!tournament) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          Torneio não encontrado
        </Alert>
      </Container>
    );
  }

  return (
    <Layout>
      <Box flex="1" bg={headerBg} minH="100vh">
        {/* Header */}
        <Box bg="white" boxShadow="sm" top="0" borderBottom="1px solid" borderColor={borderColor}>
          <Container maxW="container.xl">
            <Flex align="center" p={4}>
              <IconButton
                aria-label="Voltar"
                icon={<ChevronLeftIcon />}
                onClick={() => router.back()}
                mr={4}
                variant="ghost"
                size="lg"
              />
              <Heading size="lg" flex="1" noOfLines={1}>
                Voltar uma página
              </Heading>

              {isAdmin && (
                <Menu>
                  <MenuButton
                    as={Button}
                    aria-label="Opções do torneio"
                    rightIcon={<SettingsIcon />}
                    variant="outline"
                    size={buttonSize}
                  >
                    {isMobile ? 'Opções' : 'Opções do Torneio'}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<AddIcon />}
                      onClick={() => router.push(`/tournaments/categories`)}
                    >
                      Nova Categoria
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<CloseIcon color="red.500" />}>
                      Cancelar Torneio
                    </MenuItem>
                    <MenuItem icon={<CheckIcon color="orange.500" />}>
                      Finalizar Torneio
                    </MenuItem>
                    <MenuItem icon={<CloseIcon color="red.500" />}>
                      Excluir Torneio
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Flex>
          </Container>
        </Box>

        {/* Conteúdo principal */}
        <Container maxW="container.xl" py={6}>
          {/* Banner e informações do torneio */}
          <Card mb={6} overflow="hidden" border="1px solid" borderColor={borderColor}>
            <Image
              src={tournament.imageHash ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${tournament.imageHash}`
                : banner.src}
              alt={tournament.eventName}
              height="500px"
              objectFit="cover"
              w="100%"
            />

            <CardBody>
              <Stack spacing={6}>
                <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
                  <Avatar
                    src={tournament.imageHash ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${tournament.imageHash}`
                      : logo.src}
                    size="xl"
                    border="2px solid"
                    borderColor="white"
                    boxShadow="md"
                    mt="-12"
                  />

                  <Box flex="1">
                    <Flex align="center" mb={2}>
                      <Badge colorScheme={getStatusColor(tournament.status)} fontSize="md" px={3} py={1}>
                        {getStatusText(tournament.status)}
                      </Badge>
                    </Flex>

                    <Heading size="xl" mb={2}>{tournament.eventName}</Heading>

                    <Flex wrap="wrap" gap={3} mb={4} align="center">
                      <Badge
                        colorScheme="blue"
                        px={3}
                        py={1}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        fontSize="sm"
                        boxShadow="sm"
                      >
                        <CalendarIcon mr={2} boxSize={3} />
                        {formatDate(tournament.tournamentStart)} - {formatDate(tournament.tournamentEnd)}
                      </Badge>

                      {tournament.tournamentLocation && (
                        <Badge
                          colorScheme="teal"
                          px={3}
                          py={1}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          fontSize="sm"
                          boxShadow="sm"
                        >
                          <Box as={FaMapMarkerAlt} mr={2} boxSize={3} />
                          {tournament.tournamentLocation}
                        </Badge>
                      )}
                    </Flex>
                  </Box>

                  <Button
                    colorScheme="blue"
                    size={buttonSize}
                    onClick={() => router.push(`/tournament/${id}/register`)}
                    leftIcon={<AddIcon />}
                    minW={isMobile ? 'full' : 'auto'}
                  >
                    Inscrever-se
                  </Button>
                </Flex>
              </Stack>
            </CardBody>
          </Card>

          {/* Abas */}
          <Tabs variant="enclosed" colorScheme="blue" isLazy>
            <TabList>
              <Tab fontWeight="semibold">
                <Box as={FaTrophy} mr={2} /> Categorias
              </Tab>
              <Tab fontWeight="semibold">
                <Box as={FaInfoCircle} mr={2} /> Informações
              </Tab>
              <Tab fontWeight="semibold">
                <Box as={FaScroll} mr={2} /> Regras
              </Tab>
            </TabList>

            <TabPanels>
              {/* Aba de categorias */}
              <TabPanel px={0}>
                {/* Filtros e busca */}
                <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={6}>
                  <InputGroup flex="1" maxW={{ md: '400px' }}>
                    <Input
                      placeholder="Pesquisar categorias..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size={buttonSize}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Pesquisar"
                        icon={<SearchIcon />}
                        variant="ghost"
                        size={buttonSize}
                      />
                    </InputRightElement>
                  </InputGroup>

                  <Flex gap={2}>
                    <Button
                      leftIcon={<IoFilterOutline />}
                      colorScheme={isFilterApplied ? "blue" : "gray"}
                      onClick={onFilterOpen}
                      size={buttonSize}
                      variant={isFilterApplied ? "solid" : "outline"}
                    >
                      Filtrar
                    </Button>

                    {isAdmin && (
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        onClick={() => router.push(`/categories/create?tournamentId=${id}`)}
                        size={buttonSize}
                      >
                        Criar Nova Categoria
                      </Button>
                    )}
                  </Flex>
                </Flex>

                {/* Lista de categorias */}
                {filteredCategories.length === 0 ? (
                  <Card>
                    <CardBody>
                      <Flex direction="column" align="center" justify="center" py={10}>
                        <InfoIcon boxSize={8} color="gray.400" mb={4} />
                        <Text fontSize="lg" color="gray.500" textAlign="center">
                          Nenhuma categoria encontrada
                        </Text>
                      </Flex>
                    </CardBody>
                  </Card>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filteredCategories.map(category => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

              {/* Aba de informações */}
              <TabPanel px={0}>
                <Card>
                  <CardBody>
                    <Stack spacing={6} divider={<Divider />}>
                      <Box>
                        <Heading size="md" mb={4} display="flex" alignItems="center">
                          <TimeIcon mr={2} /> Datas Importantes
                        </Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="semibold">Período de Inscrições:</Text>
                            <Text>
                              {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontWeight="semibold">Período do Torneio:</Text>
                            <Text>
                              {formatDate(tournament.tournamentStart)} - {formatDate(tournament.tournamentEnd)}
                            </Text>
                          </Box>
                        </SimpleGrid>
                      </Box>

                      {tournament.tournamentLocation && (
                        <Box>
                          <Heading size="md" mb={4} display="flex" alignItems="center">
                            <Badge colorScheme="teal" px={2} py={1}>
                              <Box as={FaMapMarkerAlt} mr={1} /> {tournament.tournamentLocation}
                            </Badge>
                          </Heading>
                          <Text>{tournament.tournamentLocation}</Text>
                        </Box>
                      )}

                      <Box>
                        <Heading size="md" mb={4} display="flex" alignItems="center">
                          <PhoneIcon mr={2} /> Contato
                        </Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="semibold">Email:</Text>
                            <Text>{tournament.contactEmail || 'Não informado'}</Text>
                          </Box>
                          <Box>
                            <Text fontWeight="semibold">Telefone:</Text>
                            <Text>{tournament.contactPhone || 'Não informado'}</Text>
                          </Box>
                        </SimpleGrid>
                      </Box>

                      {tournament.eventName && (
                        <Box>
                          <Heading size="md" mb={4} display="flex" alignItems="center">
                            <InfoIcon mr={2} /> Descrição
                          </Heading>
                          <Text whiteSpace="pre-line">{tournament.waitlistInfo}</Text>
                        </Box>
                      )}
                    </Stack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Aba de regras */}
              <TabPanel px={0}>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>📜 Regras do Torneio</Heading>
                    <Text whiteSpace="pre-line">
                      {tournament.tournamentRules || 'Nenhuma regra específica definida para este torneio.'}
                    </Text>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>

        {/* Modal de filtro */}
        <Modal isOpen={isFilterOpen} onClose={onFilterClose} size={isMobile ? 'full' : 'md'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Filtrar Categorias</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={6}>
                <Box>
                  <Heading size="sm" mb={3}>Status</Heading>
                  <CheckboxGroup
                    value={selectedStatuses}
                    onChange={(values) => setSelectedStatuses(values as string[])}
                  >
                    <Stack spacing={3}>
                      <Checkbox value="ativo" size="lg" colorScheme="green">
                        Ativo
                      </Checkbox>
                      <Checkbox value="concluido" size="lg" colorScheme="orange">
                        Concluído
                      </Checkbox>
                      <Checkbox value="cancelado" size="lg" colorScheme="red">
                        Cancelado
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </Box>

                <Box>
                  <Heading size="sm" mb={3}>Nível</Heading>
                  <CheckboxGroup
                    value={selectedCategories}
                    onChange={(values) => setSelectedCategories(values as string[])}
                  >
                    <Stack spacing={3}>
                      <Checkbox value="A" size="lg">
                        Categoria A
                      </Checkbox>
                      <Checkbox value="B" size="lg">
                        Categoria B
                      </Checkbox>
                      <Checkbox value="C" size="lg">
                        Categoria C
                      </Checkbox>
                      <Checkbox value="D" size="lg">
                        Categoria D
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                mr={3}
                onClick={() => {
                  setSelectedStatuses([]);
                  setSelectedCategories([]);
                }}
                size={buttonSize}
              >
                Limpar Filtros
              </Button>
              <Button
                colorScheme="blue"
                onClick={onFilterClose}
                size={buttonSize}
              >
                Aplicar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de detalhes da categoria */}
        {selectedCategory && (
          <Modal
            isOpen={isCategoryModalOpen}
            onClose={onCategoryModalClose}
            size={isMobile ? 'full' : 'xl'}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Detalhes da Categoria</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={6}>
                  <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
                    <Avatar
                      src={selectedCategory.imageHash ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${selectedCategory.imageHash}` : '/default-category.png'}
                      size="xl"
                    />
                    <Box flex="1">
                      <Heading size="lg">{selectedCategory.name}</Heading>
                      <Flex wrap="wrap" gap={2} mt={2}>
                        <Badge colorScheme={getStatusColor(selectedCategory.status)}>
                          {getStatusText(selectedCategory.status)}
                        </Badge>
                        <Badge colorScheme="purple">
                          {selectedCategory.dispute_model}
                        </Badge>
                        <Badge colorScheme="blue">
                          {selectedCategory.game_type}
                        </Badge>
                        <Badge colorScheme="teal">
                          {selectedCategory.gender}
                        </Badge>
                      </Flex>
                    </Box>
                  </Flex>

                  <Divider />

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box>
                      <Heading size="sm" mb={3}>📅 Datas</Heading>
                      <Stack spacing={2}>
                        <Box>
                          <Text fontWeight="semibold">Inscrições:</Text>
                          <Text>
                            {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="semibold">Jogos:</Text>
                          <Text>
                            {formatDate(tournament.tournamentStart)} - {formatDate(tournament.tournamentEnd)}
                          </Text>
                        </Box>
                      </Stack>
                    </Box>

                    <Box>
                      <Heading size="sm" mb={3}>👥 Inscrições</Heading>
                      <Stack spacing={2}>
                        <Box>
                          <Text fontWeight="semibold">Vagas:</Text>
                          <Text>
                            {selectedCategory.current_registrations || 0}/{selectedCategory.max_registrations}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="semibold">Progresso:</Text>
                          <Progress
                            value={((selectedCategory.current_registrations || 0) / selectedCategory.max_registrations) * 100}
                            size="sm"
                            colorScheme="blue"
                            borderRadius="full"
                          />
                        </Box>
                      </Stack>
                    </Box>
                  </SimpleGrid>

                  {isAdmin && (
                    <>
                      <Divider />

                      <Box>
                        <Heading size="sm" mb={3}>⚙️ Ações Rápidas</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                          <Button
                            colorScheme="blue"
                            onClick={() => {
                              onCategoryModalClose();
                              router.push(`/tournament/${id}/category/${selectedCategory.id}/subscribers`);
                            }}
                            leftIcon={<IoPeopleOutline />}
                          >
                            Gerenciar Inscritos
                          </Button>

                          <Button
                            colorScheme="blue"
                            onClick={() => {
                              onCategoryModalClose();
                              router.push(`/tournament/${id}/category/${selectedCategory.id}/groups`);
                            }}
                            leftIcon={<IoShirtOutline />}
                          >
                            Ver Grupos
                          </Button>

                          <Button
                            colorScheme="orange"
                            onClick={() => {
                              onCategoryModalClose();
                              // Implementar lógica para encerrar inscrições
                            }}
                            leftIcon={<CloseIcon />}
                          >
                            Encerrar Inscrições
                          </Button>

                          <Button
                            colorScheme="red"
                            onClick={() => {
                              onCategoryModalClose();
                              // Implementar lógica para excluir categoria
                            }}
                            leftIcon={<CloseIcon />}
                          >
                            Excluir Categoria
                          </Button>
                        </SimpleGrid>
                      </Box>
                    </>
                  )}
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCategoryModalClose}
                  size={buttonSize}
                >
                  Fechar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Layout>
  );
};

TournamentView.authRequired = true;
export default TournamentView;