import React, { useState } from 'react';
import {
  Box, Heading, Text, VStack, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure,
  Badge, useColorModeValue
} from '@chakra-ui/react';
import { FaLock, FaUnlock, FaLightbulb, FaTags } from 'react-icons/fa';

const sampleProblem = {
  id: 1,
  title: "Two Sum",
  statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  inputDescription: "An array of integers nums and an integer target.",
  outputDescription: "Return indices of the two numbers such that they add up to target.",
  constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
  sampleTestCases: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    { input: "nums = [3,3], target = 6", output: "[0,1]" }
  ],
  hints: [
    "Consider using a hash table to store complements.",
    "You can solve this in one pass through the array.",
    "Think about the time complexity of your solution."
  ],
  topics: ["Array", "Hash Table"]
};

const ProblemComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [unlockedHints, setUnlockedHints] = useState([]);

  const unlockHint = (hintIndex) => {
    setUnlockedHints([...unlockedHints, hintIndex]);
    onClose();
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" bg={bgColor} borderColor={borderColor} boxShadow="lg">
      <VStack align="stretch" spacing={6}>
        <Heading as="h1" size="xl" color={useColorModeValue('blue.600', 'blue.300')}>{sampleProblem.title}</Heading>
        <Text fontSize="lg">{sampleProblem.statement}</Text>
        
        <Box>
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('green.600', 'green.300')}>Input Description</Heading>
          <Text>{sampleProblem.inputDescription}</Text>
        </Box>
        
        <Box>
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('green.600', 'green.300')}>Output Description</Heading>
          <Text>{sampleProblem.outputDescription}</Text>
        </Box>
        
        <Box>
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('red.600', 'red.300')}>Constraints</Heading>
          <Text whiteSpace="pre-line">{sampleProblem.constraints}</Text>
        </Box>
        
        <Box>
          <Heading as="h2" size="md" mb={4} color={useColorModeValue('purple.600', 'purple.300')}>Sample Test Cases</Heading>
          {sampleProblem.sampleTestCases.map((testCase, index) => (
            <Box key={index} mb={4} p={4} borderWidth={1} borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
              <Text fontWeight="bold">Input:</Text>
              <Text fontFamily="monospace" my={2}>{testCase.input}</Text>
              <Text fontWeight="bold">Output:</Text>
              <Text fontFamily="monospace" my={2}>{testCase.output}</Text>
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
              {sampleProblem.hints.map((hint, index) => (
                <Button
                  key={index}
                  leftIcon={unlockedHints.includes(index) ? <FaUnlock /> : <FaLock />}
                  onClick={unlockedHints.includes(index) ? null : onOpen}
                  mb={2}
                  mr={2}
                  colorScheme={unlockedHints.includes(index) ? "green" : "gray"}
                >
                  {unlockedHints.includes(index) ? hint : `Hint ${index + 1}`}
                </Button>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        
        <Box>
          <Heading as="h2" size="md" mb={2} display="flex" alignItems="center">
            <FaTags style={{ marginRight: '8px' }} /> Topics
          </Heading>
          {sampleProblem.topics.map((topic, index) => (
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
            <Button colorScheme="blue" mr={3} onClick={() => unlockHint(sampleProblem.hints.findIndex((_, i) => !unlockedHints.includes(i)))}>
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