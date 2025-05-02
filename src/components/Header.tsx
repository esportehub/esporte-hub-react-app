import { Flex, IconButton, Image, Avatar, Button, Box } from '@chakra-ui/react';
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
  const isMobile = true;

  const mockUser = {
    name: 'Convidado',
    avatar: undefined
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
      {/* Botão do menu (esquerda) */}
      <Box flex="1">
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            color="white"
            fontSize="20px"
            onClick={onOpen}
            aria-label="Abrir menu"
          />
        )}
      </Box>

      {/* Logo (centro) */}
      <Box 
        position="absolute" 
        left="50%"
        transform="translateX(-50%)"
      >
        <Image 
          src={logo.src}
          alt="EsporteHub" 
          h={{ base: '30px', md: '40px' }} 
          objectFit="contain"
          onClick={() => router.push('/')}
          cursor="pointer"
        />
      </Box>

      {/* Botões de esporte (centro em desktop) */}
      {!isMobile && (
        <Flex align="center" gap={2} position="absolute" left="50%" transform="translateX(-50%)">
          <Button variant="ghost" colorScheme="green" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
            Beach Tennis
          </Button>
          <Button variant="ghost" colorScheme="green" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
            Futevolei
          </Button>
        </Flex>
      )}

      {/* Avatar (direita) */}
      <Box flex="1" display="flex" justifyContent="flex-end">
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
      </Box>
    </Flex>
  );
};

export default Header;