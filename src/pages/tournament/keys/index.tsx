import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  Box,
  Card,
  Avatar,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Stack
} from '@chakra-ui/react';
import { EditIcon, ArrowBackIcon } from '@chakra-ui/icons';

interface Player {
  name: string;
  partner: string;
  imagePath: string;
  score: string[];
  partnerImagePath: string;
}

interface Match {
  id: number;
  title: string;
  date: string;
  players: Player[];
}

const TournamentKeysPage: React.FC = () => {
  const router = useRouter();
  
  // Sample player data
  const initialMatches: Match[] = [
    {
      id: 1,
      title: '#2 • R16 • Arena Éssipé',
      date: 'Sábado, 25/05/24 às 12:30hs',
      players: [
        { 
          name: 'Alexandre Gemignani', 
          partner: 'Danilo Silva', 
          imagePath: '/assets/player1.jpg', 
          score: ['4', '3'], 
          partnerImagePath: '/assets/player3.jpg' 
        },
        { 
          name: 'Alexandre Chuck', 
          partner: 'Paulo Junior', 
          imagePath: '/assets/player2.jpg', 
          score: ['6', '6'], 
          partnerImagePath: '/assets/player3.jpg' 
        },
      ]
    },
    {
      id: 2,
      title: '#3 • R16',
      date: '',
      players: [
        { 
          name: 'Alex Zaratini', 
          partner: 'José Silva', 
          imagePath: '/assets/player3.jpg', 
          score: [], 
          partnerImagePath: '/assets/player3.jpg' 
        },
        { 
          name: 'BYE', 
          partner: '', 
          imagePath: '', 
          score: [], 
          partnerImagePath: '' 
        },
      ]
    },
    {
      id: 3,
      title: '#4 • R16 • Arena Éssipé',
      date: 'Sábado, 25/05/24 às 12:30hs',
      players: [
        { 
          name: 'Ariel Bekhor', 
          partner: 'Rony Grabarz', 
          imagePath: '/assets/player4.jpg', 
          score: ['6', '4'], 
          partnerImagePath: '/assets/player3.jpg' 
        },
        { 
          name: 'Luan Santos', 
          partner: 'Renato Holanda', 
          imagePath: '/assets/player5.jpg', 
          score: ['7', '6'], 
          partnerImagePath: '/assets/player3.jpg' 
        },
      ]
    },
  ];

  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [editingScores, setEditingScores] = useState<{ teamA: string[], teamB: string[] }>({ teamA: [], teamB: [] });

  const handleEditScore = (matchId: number) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setEditingMatchId(matchId);
      setEditingScores({
        teamA: [...match.players[0].score],
        teamB: [...match.players[1].score]
      });
    }
  };

  const handleScoreChange = (team: 'teamA' | 'teamB', index: number, value: string) => {
    const newScores = { ...editingScores };
    newScores[team][index] = value;
    setEditingScores(newScores);
  };

  const saveScores = () => {
    setMatches(matches.map(match => {
      if (match.id === editingMatchId) {
        const updatedPlayers = [...match.players];
        updatedPlayers[0].score = [...editingScores.teamA];
        updatedPlayers[1].score = [...editingScores.teamB];
        return { ...match, players: updatedPlayers };
      }
      return match;
    }));
    setEditingMatchId(null);
  };

  const PlayerRow: React.FC<{ player: Player; isTeamA: boolean }> = ({ player, isTeamA }) => (
    <Flex alignItems="center" my={2}>
      {player.imagePath && (
        <Avatar src={player.imagePath} size="sm" />
      )}
      {player.partnerImagePath && (
        <Avatar src={player.partnerImagePath} size="sm" ml={1} />
      )}
      <Box ml={3} flexGrow={1}>
        <Text>{player.name}</Text>
        <Text fontSize="sm">{player.partner}</Text>
      </Box>
      {player.score.length > 0 && (
        <Text fontWeight="bold" color={isTeamA ? 'blue.500' : 'orange.500'}>
          {player.score.join(' ')}
        </Text>
      )}
    </Flex>
  );

  const MatchCard: React.FC<{ match: Match }> = ({ match }) => (
    <Card p={4} my={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">{match.title}</Text>
        <IconButton
          aria-label="Edit score"
          icon={<EditIcon />}
          onClick={() => handleEditScore(match.id)}
          variant="ghost"
        />
      </Flex>
      <Box mt={2}>
        <PlayerRow player={match.players[0]} isTeamA={true} />
        <PlayerRow player={match.players[1]} isTeamA={false} />
      </Box>
      {match.date && (
        <Text mt={2} fontSize="sm">{match.date}</Text>
      )}
    </Card>
  );

  return (
    <Box p={4}>
      <Flex alignItems="center" mb={4}>
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          onClick={() => router.back}
          mr={4}
        />
        <Heading size="lg">Chaves da categoria</Heading>
      </Flex>

      <Stack spacing={4}>
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </Stack>

      {/* Edit Score Modal */}
      <Modal isOpen={editingMatchId !== null} onClose={() => setEditingMatchId(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Placar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box overflowX="auto">
              <Table variant="simple" minWidth="300px">
                <Thead>
                  <Tr>
                    {['1Set', '2Set', '3Set', '4Set', '5Set'].map((set, index) => (
                      <Th key={index} px={2} py={2}>{set}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Td key={`teamA-${index}`} px={2} py={2}>
                        <Input
                          size="sm"
                          value={editingScores.teamA[index] || ''}
                          onChange={(e) => handleScoreChange('teamA', index, e.target.value)}
                        />
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Td key={`teamB-${index}`} px={2} py={2}>
                        <Input
                          size="sm"
                          value={editingScores.teamB[index] || ''}
                          onChange={(e) => handleScoreChange('teamB', index, e.target.value)}
                        />
                      </Td>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setEditingMatchId(null)}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={saveScores}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TournamentKeysPage;