import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  useColorModeValue,
  useColorMode,
  Switch,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import algologo from '../assets/algosprint_logo.jpeg';

const Headerb = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box as="header" bg={bgColor} boxShadow="sm" position="sticky" top={0} zIndex={1000}>
      <Flex
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        maxWidth="1200px"
        margin="0 auto"
      >
        <Flex align="center" mr={5}>
          <Image
            borderRadius="full"
            boxSize="40px"
            src={algologo}
            alt="AlgoSprint Logo"
            mr={3}
          />
          <RouterLink to='/home'>
            <Text fontSize="xl" fontWeight="bold" color="#127d7e">
              AlgoSprint
            </Text>
          </RouterLink>
        </Flex>

        <Flex align="center" spacing={4}>
          <Button as={RouterLink} to="/user/login" variant="ghost" mr={2} _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }} color={textColor}>
            Login
          </Button>
          <Button as={RouterLink} to="/user/signup" colorScheme="blue" mr={4}>
            Sign Up
          </Button>
          <Flex align="center">
            <SunIcon color={textColor} />
            <Switch
              ml={2}
              mr={2}
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
            <MoonIcon color={textColor} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Headerb;