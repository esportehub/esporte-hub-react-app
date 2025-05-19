import React, { useState } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Heading,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  Avatar,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {format, startOfWeek, parse, getDay} from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const TournamentCalendarPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  //@typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState(new Date());

  const bg = useColorModeValue('gray.100', 'gray.700');

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

  const upcomingEvents = events.filter(e => e.type === 'upcoming');
  const pastEvents = events.filter(e => e.type === 'past');

  return (
    <Box minH="100vh" bg={bg} p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Calendar</Heading>
        <Badge colorScheme="blue" borderRadius="full" px={2} py={1}>
          <IconButton
            aria-label="Chat"
            icon={<ChatIcon />} 
            size="sm"
            variant="ghost"
          />
        </Badge>
      </Flex>

      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" mb={6}>
        <TabList>
          <Tab borderTopRadius="md">Month</Tab>
          <Tab borderTopRadius="md">Week</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Calendar
              localizer={localizer}
              style={{ height: 500 }}
              view="month"
              onSelectEvent={setSelectedDate}
              onNavigate={setSelectedDate}
              //@typescript-eslint/no-explicit-any
              eventPropGetter={(event:any) => ({
                style: {
                  backgroundColor: event.type === 'upcoming' ? '#3182ce' : '#805ad5'
                }
              })}
            />
          </TabPanel>

          <TabPanel>
            <Calendar
              localizer={localizer}
              style={{ height: 500 }}
              view="week"
              onSelectEvent={setSelectedDate}
              onNavigate={setSelectedDate}
              //@typescript-eslint/no-explicit-any
              eventPropGetter={(event:any) => ({
                style: {
                  backgroundColor: event.type === 'upcoming' ? '#3182ce' : '#805ad5'
                }
              })}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box>
        <Heading size="md" mb={2}>Coming Up</Heading>
        <List spacing={3} mb={6}>
          {upcomingEvents.map((event, idx) => (
            <Box key={idx} p={4} bg="white" borderRadius="md" shadow="sm">
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontWeight="bold">{event.title}</Text>
                  <Text fontSize="sm">{format(event.start, 'EEE, MM/dd/yyyy')}</Text>
                </Box>
                <Avatar bg="blue.100" color="blue.800" size="sm" name="Time">
                  <Text fontSize="xs">{format(event.start, 'h:mm a')}</Text>
                </Avatar>
              </Flex>
            </Box>
          ))}
        </List>

        <Heading size="md" mb={2}>Past Due</Heading>
        <List spacing={3}>
          {pastEvents.map((event, idx) => (
            <Box key={idx} p={4} bg="white" borderRadius="md" shadow="sm">
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontWeight="bold">{event.title}</Text>
                  <Text fontSize="sm">{format(event.start, 'EEE, MM/dd/yyyy')}</Text>
                </Box>
                <Avatar bg="purple.100" color="purple.800" size="sm" name="Time">
                  <Text fontSize="xs">{format(event.start, 'h:mm a')}</Text>
                </Avatar>
              </Flex>
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TournamentCalendarPage;
