import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, VStack, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure,
  Badge, useColorModeValue
} from '@chakra-ui/react';
import { FaLock, FaUnlock, FaLightbulb, FaTags } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const ProblemComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [unlockedHints, setUnlockedHints] = useState([]);
  const [problem, setProblem] = useState({
    title: '',
    problem_statement: '',
    input_description: '',
    output_description: '',
    sample_cases: [],
    constraints: '',
    hints: [{}],
    topics: []
  });

  const { problemId } = useParams();

  useEffect(() => {
    async function getProblemDetails() {
      try {
        const response = await fetch(`http://localhost:2999/problemdetails/${problemId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const problemDetails = await response.json();
        setProblem(problemDetails);
      } catch (error) {
        console.error('Error fetching problem details:', error.message);
        // Handle the error appropriately, e.g., show a toast or an error message
      }
    }

    getProblemDetails();
  }, [problemId]);

  const unlockHint = (hintIndex) => {
    setUnlockedHints([...unlockedHints, hintIndex]);
    onClose();
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" bg={bgColor} borderColor={borderColor} boxShadow="lg">
      <VStack align="stretch" spacing={6}>
        <Heading as="h1" size="xl" color={useColorModeValue('blue.600', 'blue.300')}>{problem.title}</Heading>
        <Text fontSize="lg">{problem.problem_statement}</Text>
        
        <Box>
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('green.600', 'green.300')}>Input Description</Heading>
          <Text>{problem.input_description}</Text>
        </Box>
        
        <Box>
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('green.600', 'green.300')}>Output Description</Heading>
          <Text>{problem.output_description}</Text>
        </Box>
        
        <Box>
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('red.600', 'red.300')}>Constraints</Heading>
          <Text whiteSpace="pre-line">{problem.constraints}</Text>
        </Box>
        
        <Box>
          <Heading as="h2" size="md" mb={4} color={useColorModeValue('purple.600', 'purple.300')}>Sample Test Cases</Heading>
          {problem.sample_cases.map((testCase, index) => (
            <Box key={index} mb={4} p={4} borderWidth={1} borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
              <Text fontWeight="bold">Input:</Text>
              <Text fontFamily="monospace" my={2}>{testCase.sample_input}</Text>
              <Text fontWeight="bold">Output:</Text>
              <Text fontFamily="monospace" my={2}>{testCase.sample_output}</Text>
            </Box>
          ))}
        </Box>
        
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading size="md" display="flex" alignItems="center">
                    <FaLightbulb style={{ marginRight: '8px' }} /> Hints
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {problem.hints.map((hint, index) => (
                <Button
                  key={index}
                  leftIcon={unlockedHints.includes(index) ? <FaUnlock /> : <FaLock />}
                  onClick={unlockedHints.includes(index) ? null : onOpen}
                  mb={2}
                  mr={2}
                  colorScheme={unlockedHints.includes(index) ? "green" : "gray"}
                >
                  {unlockedHints.includes(index) ? hint.hints : `Hint ${index + 1}`}
                </Button>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        
        <Box>
          <Heading as="h2" size="md" mb={2} display="flex" alignItems="center">
            <FaTags style={{ marginRight: '8px' }} /> Topics
          </Heading>
          {problem.topics.map((topic, index) => (
            <Badge key={index} mr={2} mb={2} colorScheme="blue" fontSize="0.8em" px={2} py={1} borderRadius="full">
              {topic}
            </Badge>
          ))}
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unlock Hint</ModalHeader>
          <ModalBody>
            Do you want to unlock this hint?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => unlockHint(problem.hints.findIndex((_, i) => !unlockedHints.includes(i)))}>
              Yes, unlock
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProblemComponent;
