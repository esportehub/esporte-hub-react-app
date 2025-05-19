import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaMoneyBillWave, FaCheckCircle, FaHourglassHalf, FaUsers } from 'react-icons/fa';

interface DataCollection {
  totalSubscribedPlayers: string;
  totalToReceive: string;
  totalPaid: string;
  totalNotPaid: string;
}

const TournamentWithdrawalsPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  //@typescript-eslint/no-unused-vars
  const toast = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Visibility toggles
  const [totalToReceiveVisible, setTotalToReceiveVisible] = useState(false);
  const [totalPaidVisible, setTotalPaidVisible] = useState(false);
  const [totalNotPaidVisible, setTotalNotPaidVisible] = useState(false);
  
  // Tournament data
  const [dataCollection, setDataCollection] = useState<DataCollection>({
    totalSubscribedPlayers: '0',
    totalToReceive: '0.00',
    totalPaid: '0.00',
    totalNotPaid: '0.00'
  });

  // Color variables
  const primaryColor = useColorModeValue('blue.500', 'blue.200');
  const successColor = useColorModeValue('green.500', 'green.200');
  const errorColor = useColorModeValue('red.500', 'red.200');
  const cardBg = useColorModeValue('white', 'gray.700');
  const adminCardBg = useColorModeValue('blue.500', 'blue.600');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - replace with actual API calls
        setIsAdmin(true); // Simulating admin user
        
        // Mock data collection
        setDataCollection({
          totalSubscribedPlayers: '42',
          totalToReceive: '1250.00',
          totalPaid: '850.00',
          totalNotPaid: '400.00'
        });
        
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tournamentId]);

  const buildInfoCard = ({
    icon,
    value,
    label,
    bgColor,
    iconColor = 'white',
    isVisible,
    onVisibilityToggle
  }: {
    icon: React.ReactElement;
    value: string;
    label: string;
    bgColor: string;
    iconColor?: string;
    isVisible: boolean;
    onVisibilityToggle?: () => void;
  }) => {
    return (
      <Card bg={bgColor} color="white" height="100%">
        <CardBody textAlign="center">
          <Box fontSize="48px" color={iconColor}>
            {icon}
          </Box>
          <Flex align="center" justify="center" mt={4}>
            <Heading size="xl">
              {isVisible ? `R$ ${value}` : '*******'}
            </Heading>
            {onVisibilityToggle && (
              <IconButton
                aria-label={isVisible ? 'Hide value' : 'Show value'}
                icon={isVisible ? <ViewIcon /> : <ViewOffIcon />}
                onClick={onVisibilityToggle}
                color={iconColor}
                variant="ghost"
                ml={2}
              />
            )}
          </Flex>
          <Text fontSize="lg" mt={2}>
            {label}
          </Text>
        </CardBody>
      </Card>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" mt={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Flex
        as="header"
        align="center"
        p={4}
        bg={cardBg}
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <IconButton
          aria-label="Voltar"
          icon={<ArrowBackIcon />}
          mr={4}
          onClick={() => navigate(-1)}
        />
        <Heading size="md" flexGrow={1}>
          Levantamentos
        </Heading>
      </Flex>

      <Box p={6}>
        {/* Players Section (Admin Only) */}
        {isAdmin && (
          <Card bg={adminCardBg} color="white" mb={6}>
            <CardBody>
              <Flex align="center">
                <Box fontSize="48px" mr={4}>
                  <Icon as={FaUsers} />
                </Box>
                <Box>
                  <Heading size="2xl">
                    {dataCollection.totalSubscribedPlayers}
                  </Heading>
                  <Text fontSize="lg">
                    Participantes
                  </Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        )}

        {/* Financial Withdrawals Section */}
        <Heading as="h2" size="lg" mb={4}>
          Levantamentos Financeiros
        </Heading>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
          <GridItem>
            {buildInfoCard({
              icon: <Icon as={FaMoneyBillWave} />,
              value: dataCollection.totalToReceive,
              label: 'Total a receber',
              bgColor: primaryColor,
              isVisible: totalToReceiveVisible,
              onVisibilityToggle: () => setTotalToReceiveVisible(!totalToReceiveVisible)
            })}
          </GridItem>
          <GridItem>
            {buildInfoCard({
              icon: <Icon as={FaCheckCircle} />,
              value: dataCollection.totalPaid,
              label: 'Total recebido',
              bgColor: successColor,
              isVisible: totalPaidVisible,
              onVisibilityToggle: () => setTotalPaidVisible(!totalPaidVisible)
            })}
          </GridItem>
          <GridItem>
            {buildInfoCard({
              icon: <Icon as={FaHourglassHalf} />,
              value: dataCollection.totalNotPaid,
              label: 'Ainda não recebido',
              bgColor: errorColor,
              isVisible: totalNotPaidVisible,
              onVisibilityToggle: () => setTotalNotPaidVisible(!totalNotPaidVisible)
            })}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default TournamentWithdrawalsPage;