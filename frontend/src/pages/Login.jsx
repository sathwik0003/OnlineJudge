import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Stack, Image, Text, Icon, Heading, Flex, ChakraProvider } from '@chakra-ui/react';
import { EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import signupimage from '../assets/algosprint_login.jpg';
import sprintlogo from '../assets/algosprint_logo.jpeg';
import wavy from '../assets/algosprint_back.jpg'



const Login = () => {
  return (
    <ChakraProvider>
    <Box display="flex" height="100vh" flexDirection={{ base: 'column', md: 'row' }}>
      {/* Left half with image and overlay */}
      <Box flex="0.82" position="relative">
        <Image src={signupimage} alt="login Image" objectFit="cover" width="100%" height={{ base: '50vh', md: '100vh' }} />
        <Box position="absolute" top="0" left="0" width="100%" height="100%" bg="rgba(0, 0, 0, 0.5)" color="white" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Text fontSize="3xl" fontWeight="bold">Welcome to AlgoSprint</Text>
          <Text fontSize="lg" mt={2} textAlign="center">Join us to improve your algorithms and coding skills.</Text>
          <Box mt={4} display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center" mt={2}>
              <Icon as={InfoIcon} w={6} h={6} mr={2} />
              <Text>Learn from the best</Text>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Icon as={EmailIcon} w={6} h={6} mr={2} />
              <Text>Get personalized feedback</Text>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Icon as={LockIcon} w={6} h={6} mr={2} />
              <Text>Secure and private</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right half with form */}
      <Box 
        flex="1" 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        py={10} 
        backgroundImage={`url(${wavy})`}
        backgroundSize="cover"
        backgroundPosition="center"
      >
        <Flex 
          width={{ base: '90%', md: '75%', lg: '60%' }} 
          flexDirection="column" 
          alignItems="center" 
          mb={6}
          p={4}
          borderRadius="md"
          bg="rgba(255, 255, 255, 0.8)"
          backdropFilter="blur(10px)"
        >
          <Flex alignItems="center">
            <Image src={sprintlogo} alt="Logo" boxSize="50px" borderRadius="full" />
            <Heading size="md" ml={3}>AlgoSprint</Heading>
          </Flex>
        </Flex>
        <Box 
          width={{ base: '90%', md: '75%', lg: '60%' }} 
          bg="rgba(255, 255, 255, 0.9)" 
          p={6} 
          borderRadius="md" 
          boxShadow="md"
          backdropFilter="blur(10px)"
        >
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" bg="white" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" bg="white" />
            </FormControl>
            <Button colorScheme="blue" width="full">Login</Button>
          </Stack>
          <Text mt={4} textAlign="center">New to AlgoSprint?</Text>
          <Button variant="link" colorScheme="blue" mt={2} display="block" margin="0 auto"><Link to='/user/signup'>SignUp</Link></Button>
        </Box>
      </Box>
    </Box>
    </ChakraProvider>
  );
}

export default Login;