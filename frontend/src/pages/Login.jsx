import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
FormLabel,
  Input,
  Stack,
  Image,
  Text,
  Icon,
  Heading,
  Flex,
  ChakraProvider,
  useToast,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import signupimage from '../assets/algosprint_login.jpg';
import sprintlogo from '../assets/algosprint_logo.jpeg';
import wavy from '../assets/algosprint_back.jpg';
import Cookies from 'js-cookie';

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFormData = () => {
    const errors = {
      username: '',
      password: '',
    };

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);

    // Return true if there are no errors
    return Object.values(errors).every((error) => !error);
  };

  const loginUser = async () => {
    try {
      const response = await fetch(`https://onlinejudge-2nas.onrender.com/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Login failed');
      }

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      const result = await response.json();
      Cookies.set('authToken', result.token, { expires: 1 });
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error.message);
      toast({
        title: 'Login Failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    setFormErrors({
      username: '',
      password: '',
    });

    const isFormValid = validateFormData();

    if (isFormValid) {
      await loginUser();
      setFormData({
        username: '',
        password: '',
      });
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <ChakraProvider>
      <Box display="flex" height="100vh" flexDirection={{ base: 'column', md: 'row' }}>
        <Box flex="0.82" position="relative">
          <Image src={signupimage} alt="Login Image" objectFit="cover" width="100%" height="100%" />
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
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="username" isInvalid={!!formErrors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    bg="white"
                  />
                  {formErrors.username && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.username}
                    </Text>
                  )}
                </FormControl>
                <FormControl id="password" isInvalid={!!formErrors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    bg="white"
                  />
                  {formErrors.password && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.password}
                    </Text>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Login
                </Button>
              </Stack>
            </form>
            <Text mt={4} textAlign="center">New to AlgoSprint?</Text>
            <Button variant="link" colorScheme="blue" mt={2} display="block" margin="0 auto">
              <Link to='/user/signup'>Sign Up</Link>
            </Button>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Login;
