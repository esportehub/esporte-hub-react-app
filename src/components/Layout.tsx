import { Box, Flex, Drawer, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import Header from '../../src/components/Header';
import Sidebar from '../../src/components/Sidebar';
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = true; // Ou sua lógica para detectar mobile
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Aqui você faria a chamada real para obter o usuário
    const fetchUser = async () => {
      try {
        // const userData = await api.getUser();
        // setUser(userData);
        
        // Mock enquanto não tem a API
        setUser({
          name: 'João Silva',
          email: 'joao@example.com',
          avatar: 'https://bit.ly/dan-abramov'
        });
      } catch (error) {
        console.error('Failed to fetch user', error);
        setUser(null); // Define como null para mostrar o mock
      }
    };
    
    fetchUser();
  }, []);

  return (
    <Box minH="100vh">
      <Header onOpen={onOpen} user={user} />
      
      <Flex>
        {/* Sidebar - Desktop */}
        {!isMobile && <Sidebar />}

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <Sidebar isMobile onClose={onClose} />
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        <Box flex="1" p={{ base: 4, md: 6 }}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;