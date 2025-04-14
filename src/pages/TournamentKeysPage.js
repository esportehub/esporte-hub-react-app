import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TournamentKeysPage = () => {
  const navigate = useNavigate();
  
  // Sample player data
  const initialMatches = [
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

  const [matches, setMatches] = useState(initialMatches);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editingScores, setEditingScores] = useState({ teamA: [], teamB: [] });

  const handleEditScore = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    setEditingMatchId(matchId);
    setEditingScores({
      teamA: [...match.players[0].score],
      teamB: [...match.players[1].score]
    });
  };

  const handleScoreChange = (team, index, value) => {
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

  const PlayerRow = ({ player, isTeamA }) => (
    <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
      {player.imagePath && (
        <Avatar src={player.imagePath} sx={{ width: 30, height: 30 }} />
      )}
      {player.partnerImagePath && (
        <Avatar src={player.partnerImagePath} sx={{ width: 30, height: 30, ml: 1 }} />
      )}
      <div style={{ marginLeft: 10, flexGrow: 1 }}>
        <div>{player.name}</div>
        <div style={{ fontSize: '0.8rem' }}>{player.partner}</div>
      </div>
      {player.score.length > 0 && (
        <div style={{ 
          fontWeight: 'bold', 
          color: isTeamA ? 'blue' : 'orange' 
        }}>
          {player.score.join(' ')}
        </div>
      )}
    </div>
  );

  const MatchCard = ({ match }) => (
    <Card sx={{ margin: '16px 0', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold' }}>{match.title}</div>
        <IconButton onClick={() => handleEditScore(match.id)}>
          <EditIcon />
        </IconButton>
      </div>
      <div style={{ marginTop: '8px' }}>
        <PlayerRow player={match.players[0]} isTeamA={true} />
        <PlayerRow player={match.players[1]} isTeamA={false} />
      </div>
      {match.date && (
        <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>{match.date}</div>
      )}
    </Card>
  );

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <h1 style={{ marginLeft: '16px', fontSize: '1.5rem' }}>Chaves da categoria</h1>
      </div>

      <div>
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* Edit Score Dialog */}
      <Dialog open={editingMatchId !== null} onClose={() => setEditingMatchId(null)}>
        <DialogTitle>Editar Placar</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ minWidth: '300px' }}>
              <thead>
                <tr>
                  {['1Set', '2Set', '3Set', '4Set', '5Set'].map((set, index) => (
                    <th key={index} style={{ padding: '8px' }}>{set}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <td key={`teamA-${index}`} style={{ padding: '8px' }}>
                      <TextField
                        size="small"
                        value={editingScores.teamA[index] || ''}
                        onChange={(e) => handleScoreChange('teamA', index, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <td key={`teamB-${index}`} style={{ padding: '8px' }}>
                      <TextField
                        size="small"
                        value={editingScores.teamB[index] || ''}
                        onChange={(e) => handleScoreChange('teamB', index, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingMatchId(null)}>Cancelar</Button>
          <Button onClick={saveScores}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TournamentKeysPage;