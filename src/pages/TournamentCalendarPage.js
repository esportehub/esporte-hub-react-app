import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Badge, 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  Avatar, 
  Divider,
  useTheme
} from '@mui/material';
import { ChatBubbleOutline, AddPhotoAlternate } from '@mui/icons-material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TournamentCalendarPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Sample events data
  const events = [
    {
      title: 'Doctors Check In',
      start: new Date(2023, 5, 15, 14, 20),
      end: new Date(2023, 5, 15, 15, 0),
      type: 'upcoming'
    },
    {
      title: 'Check In',
      start: new Date(2023, 5, 10, 14, 20),
      end: new Date(2023, 5, 10, 15, 0),
      type: 'past'
    }
  ];

  const upcomingEvents = events.filter(event => event.type === 'upcoming');
  const pastEvents = events.filter(event => event.type === 'past');

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Calendar
          </Typography>
          <Badge 
            badgeContent={1} 
            color="primary"
            sx={{ mr: 2 }}
          >
            <IconButton color="inherit">
              <ChatBubbleOutline />
            </IconButton>
          </Badge>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Paper sx={{ mb: 2, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                height: 0
              }
            }}
          >
            <Tab 
              label="Month" 
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: '12px 0 0 0'
                }
              }}
            />
            <Tab 
              label="Week" 
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: '0 12px 0 0'
                }
              }}
            />
          </Tabs>

          <Box sx={{ 
            p: 2, 
            backgroundColor: theme.palette.background.paper,
            borderRadius: '0 0 12px 12px'
          }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              view={tabValue === 0 ? 'month' : 'week'}
              onSelectEvent={handleDateChange}
              onNavigate={handleDateChange}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: 
                    event.type === 'upcoming' 
                      ? theme.palette.primary.main 
                      : theme.palette.secondary.main,
                }
              })}
            />
          </Box>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, ml: 1 }}>
            Coming Up
          </Typography>
          <Paper sx={{ borderRadius: 2 }}>
            <List>
              {upcomingEvents.map((event, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={event.title}
                      secondary={`${format(event.start, 'EEE, MM/dd/yyyy')}`}
                      primaryTypographyProps={{ 
                        variant: 'h6',
                        color: 'text.primary'
                      }}
                      secondaryTypographyProps={{ 
                        variant: 'body2',
                        color: 'text.secondary'
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mr: 2
                    }}>
                      <Box sx={{ 
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        mr: 1
                      }}>
                        <Typography variant="body2">
                          {format(event.start, 'h:mm a')}
                        </Typography>
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <Avatar sx={{ 
                          backgroundColor: theme.palette.background.default,
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                          <AddPhotoAlternate color="primary" />
                        </Avatar>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < upcomingEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, ml: 1 }}>
            Past Due
          </Typography>
          <Paper sx={{ borderRadius: 2 }}>
            <List>
              {pastEvents.map((event, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={event.title}
                      secondary={`${format(event.start, 'EEE, MM/dd/yyyy')}`}
                      primaryTypographyProps={{ 
                        variant: 'h6',
                        color: 'text.primary'
                      }}
                      secondaryTypographyProps={{ 
                        variant: 'body2',
                        color: 'text.secondary'
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mr: 2
                    }}>
                      <Box sx={{ 
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        mr: 1
                      }}>
                        <Typography variant="body2">
                          {format(event.start, 'h:mm a')}
                        </Typography>
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <Avatar sx={{ 
                          backgroundColor: theme.palette.background.default,
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                          <AddPhotoAlternate color="primary" />
                        </Avatar>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < pastEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default TournamentCalendarPage;