import { Box, List, ListItem, Button } from '@chakra-ui/react';
import { 
  FiHome, 
  FiPlus, 
  FiAward, 
  FiLogOut 
} from 'react-icons/fi';
import { useRouter } from 'next/router';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobile = false, onClose }: SidebarProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile && onClose) onClose();
  };

  return (
    <Box
      as="aside"
      w={isMobile ? "full" : "240px"}
      h={isMobile ? "full" : "calc(100vh - 72px)"}
      bg="white"
      borderRight={!isMobile ? "1px solid" : "none"}
      borderColor="gray.200"
      py={4}
    >
      <List spacing={1} px={2}>
        <ListItem>
          <Button
            w="full"
            justifyContent="flex-start"
            leftIcon={<FiHome />}
            variant="ghost"
            colorScheme="green"
            onClick={() => handleNavigation('/')}
          >
            Início
          </Button>
        </ListItem>
        <ListItem>
          <Button
            w="full"
            justifyContent="flex-start"
            leftIcon={<FiPlus />}
            variant="ghost"
            colorScheme="green"
            onClick={() => handleNavigation('/tournaments/create')}
          >
            Criar Torneio
          </Button>
        </ListItem>
        <ListItem>
          <Button
            w="full"
            justifyContent="flex-start"
            leftIcon={<FiAward />}
            variant="ghost"
            colorScheme="green"
            onClick={() => handleNavigation('/tournaments')}
          >
            Ver Torneios
          </Button>
        </ListItem>
      </List>
      
      <Box mt="auto" px={2} pt={4}>
        <Button
          w="full"
          leftIcon={<FiLogOut />}
          colorScheme="red"
          variant="outline"
          onClick={() => handleNavigation('/login')}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;