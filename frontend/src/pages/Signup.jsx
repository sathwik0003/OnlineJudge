import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Image, Text, Icon, Heading, Flex, ChakraProvider, SimpleGrid, HStack } from '@chakra-ui/react';
import { EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import signupimage from '../assets/algosprint_login.jpg';
import wavy from '../assets/algosprint_back.jpg';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <ChakraProvider>
    <Box display="flex" height="100vh" flexDirection={{ base: 'column', md: 'row' }}>
      {/* Left side with image and overlay (45%) */}
      <Box flex="0.82" position="relative">
        <Image src={signupimage} alt="Signup Image" objectFit="cover" width="100%" height="100%" />
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

      {/* Right side with form (55%) */}
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
          width="85%" 
          flexDirection="column" 
          alignItems="center" 
          mb={6}
          p={4}
          borderRadius="md"
          bg="rgba(255, 255, 255, 0.8)"
          backdropFilter="blur(10px)"
        >
          <Flex alignItems="center">
            <Image src={signupimage} alt="Logo" boxSize="50px" borderRadius="full" />
            <Heading size="md" ml={3}>AlgoSprint</Heading>
          </Flex>
        </Flex>
        <Box 
          width="85%" 
          bg="rgba(255, 255, 255, 0.9)" 
          p={8} 
          borderRadius="lg" 
          boxShadow="xl"
          backdropFilter="blur(10px)"
        >
          <SimpleGrid columns={2} spacing={6}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" bg="white" borderColor="gray.300" _hover={{ borderColor: "gray.400" }} />
            </FormControl>
            <FormControl id="firstName">
              <FormLabel>First Name</FormLabel>
              <Input type="text" bg="white" borderColor="gray.300" _hover={{ borderColor: "gray.400" }} />
            </FormControl>
            <FormControl id="lastName">
              <FormLabel>Last Name</FormLabel>
              <Input type="text" bg="white" borderColor="gray.300" _hover={{ borderColor: "gray.400" }} />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" bg="white" borderColor="gray.300" _hover={{ borderColor: "gray.400" }} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" bg="white" borderColor="gray.300" _hover={{ borderColor: "gray.400" }} />
            </FormControl>
            <FormControl id="confirmPassword">
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" bg="white" borderColor="gray.300" _hover={{ borderColor: "gray.400" }} />
            </FormControl>
          </SimpleGrid>
          <Button colorScheme="blue" width="50%" mt={8} mx="auto" display="block">Sign Up</Button>
          <HStack justifyContent="center" mt={4}>
            <Text>Already have an account?</Text>
            <Button variant="link" colorScheme="blue"><Link to='/user/login'>Login</Link></Button>
          </HStack>
        </Box>
      </Box>
    </Box>
    </ChakraProvider>
  );
}

export default Signup;