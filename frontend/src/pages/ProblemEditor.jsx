import React from 'react';
import { Box, Container, VStack, Heading } from '@chakra-ui/react';
import EditProblem from '@/components/EditProblem';
import Header from '@/components/ui/Header';
import Footer from '@/components/Footer';

const ProblemEditor = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      
      <Container maxW="container.xl" flex="1" py={1}>
        <VStack spacing={8} align="stretch">
          
          <EditProblem />
        </VStack>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default ProblemEditor;