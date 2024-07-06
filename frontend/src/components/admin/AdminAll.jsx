import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useToast,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AdminAll = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:2999/api/problems')
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((error) => {
        toast({
          title: 'Error fetching problems',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }, []);

  const handleDelete = (problem) => {
    setSelectedProblem(problem);
    onOpen();
  };

  const handleConfirmDelete = () => {
    if (confirmText === 'confirm') {
      const pId = selectedProblem._id;
      fetch(`http://localhost:2999/problem/${pId}`, { method: 'DELETE' })
        .then((res) => {
          if (res.ok) {
            setProblems(problems.filter((p) => p._id !== selectedProblem._id));
            toast({
              title: 'Problem deleted',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            onClose();
          } else {
            throw new Error('Failed to delete problem');
          }
        })
        .catch((error) => {
          toast({
            title: 'Error deleting problem',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const handleUpdate = (problem) => {
    navigate(`/admin/update/${problem._id}`);
  };

  return (
    <Box p={5}>
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {problems.map((problem) => (
          <Box key={problem._id} borderWidth={1} borderRadius="lg" overflow="hidden" p={4}>
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold" fontSize="xl">{problem.title}</Text>
              <HStack>
                <Badge colorScheme="blue">Submissions: {problem.submissions}</Badge>
                <Badge colorScheme="green">Successful: {problem.succesful}</Badge>
              </HStack>
              <Text>Level: {problem.level}</Text>
              <Text>Topics: {problem.topics.join(', ')}</Text>
              <HStack spacing={2} mt={2}>
                <Button colorScheme="blue" size="sm" onClick={() => handleUpdate(problem)}>
                  Update
                </Button>
                <Button colorScheme="red" size="sm" onClick={() => handleDelete(problem)}>
                  Delete
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Type 'confirm' to delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminAll;