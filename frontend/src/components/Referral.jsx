import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Container, Heading, Text, VStack, HStack, Button, useToast, Input, Icon, Spinner, useColorModeValue } from '@chakra-ui/react';
import { FaUserFriends, FaCoins, FaLink, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Referral = () => {
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('gray.50', 'gray.700');
  const highlightBgColor = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('authToken');
      const response = await fetch('http://localhost:2999/user/referral', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load referral data. Please try again later.');
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading referral data...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent>
        <Text color="red.500">{error}</Text>
        <Button mt={4} onClick={fetchReferralData}>Try Again</Button>
      </Container>
    );
  }

  if (!referralData) return null;

  return (
    <Container maxW="container.md" py={8} bg={bgColor}>
      <VStack spacing={8} as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Heading as="h1" size="xl" color={headingColor}>Our Referral Program</Heading>

        <Box bg={highlightBgColor} p={6} borderRadius="lg" w="full">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold" color={textColor}>Earn AS Coins</Text>
              <HStack>
                <Icon as={FaCoins} color="yellow.500" />
                <Text fontSize="xl" fontWeight="bold" color={headingColor}>30</Text>
              </HStack>
            </HStack>
            <Text color={textColor}>For every successful referral</Text>
          </VStack>
        </Box>

        <Box bg={cardBgColor} p={6} borderRadius="lg" w="full">
          <VStack spacing={4} align="stretch">
            <HStack>
              <Icon as={FaUserFriends} color="green.500" />
              <Text fontSize="lg" fontWeight="bold" color={textColor}>Your Referrals</Text>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold" color="green.500">{referralData.referralCount}</Text>
          </VStack>
        </Box>

        <Box bg={cardBgColor} p={6} borderRadius="lg" w="full">
          <VStack spacing={4} align="stretch">
            <HStack>
              <Icon as={FaLink} color="purple.500" />
              <Text fontSize="lg" fontWeight="bold" color={textColor}>Your Referral Code</Text>
            </HStack>
            <HStack>
              <Input value={referralData.referralCode} isReadOnly bg={useColorModeValue('white', 'gray.600')} color={textColor} />
              <Button onClick={copyReferralCode} colorScheme="purple">Copy</Button>
            </HStack>
          </VStack>
        </Box>

        {referralData.referredBy && (
          <Box bg={cardBgColor} p={6} borderRadius="lg" w="full">
            <VStack spacing={4} align="stretch">
              <HStack>
                <Icon as={FaUser} color="teal.500" />
                <Text fontSize="lg" fontWeight="bold" color={textColor}>Referred By</Text>
              </HStack>
              <Text color={textColor}>{referralData.referredBy}</Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Referral;