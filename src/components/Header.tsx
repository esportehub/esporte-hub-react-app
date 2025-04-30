import { Flex, IconButton, Image, Avatar, Button } from '@chakra-ui/react';
import { FiMenu, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import logo from "../../src/assets/esporte-hub-logo.png";

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

interface HeaderProps {
  onOpen: () => void;
  user?: User | null;
}

const Header = ({ onOpen, user }: HeaderProps) => {
  const router = useRouter();
  const primaryColor = '#149E4C';
  const isMobile = true; // Ou sua lógica para detectar mobile

  // Dados mockados para quando não houver usuário
  const mockUser = {
    name: 'Convidado',
    avatar: undefined // Isso fará o Avatar mostrar o ícone padrão
  };

  const currentUser = user || mockUser;

  return (
    <Flex
      as="header"
      bg="black"
      color="white"
      px={{ base: 4, md: 6 }}
      py={4}
      align="center"
      justify="space-between"
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow="sm"
    >
      <Flex align="center">
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            color="white"
            fontSize="20px"
            mr={2}
            onClick={onOpen}
            aria-label="Abrir menu"
          />
        )}
        
        <Image 
          src={logo.src}
          alt="EsporteHub" 
          h={{ base: '30px', md: '40px' }} 
          objectFit="contain"
          onClick={() => router.push('/')}
          cursor="pointer"
        />
      </Flex>
      
      {!isMobile && (
        <Flex align="center" gap={2}>
          <Button variant="ghost" colorScheme="green" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
            Beach Tennis
          </Button>
          <Button variant="ghost" colorScheme="green" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
            Futevolei
          </Button>
        </Flex>
      )}
      
      <Avatar 
        src={currentUser.avatar}
        name={currentUser.name}
        icon={!currentUser.avatar && !currentUser.name ? <FiUser /> : undefined}
        size="sm" 
        cursor="pointer"
        onClick={() => router.push(user ? '/me/profile' : '/login')}
        border={`2px solid ${primaryColor}`}
        bg={!currentUser.avatar ? 'gray.600' : undefined}
      />
    </Flex>
  );
};

export default Header;