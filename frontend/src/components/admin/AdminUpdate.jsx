import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
  Heading,
  Select,
  Container,
  Spinner,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminUpdate = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:2999/problemdetails/${problemId}`)
      .then((res) => res.json())
      .then((data) => {
        setProblem(data);
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: 'Error fetching problem',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      });
  }, [problemId, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:2999/problem/update/${problemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(problem),
    })
      .then(async (res) => {
        if (!res.ok) {
          const textError = await res.text();
          throw new Error(`Server responded with ${res.status}: ${textError}`);
        }
        return res.json();
      })
      .then((data) => {
        toast({
          title: 'Problem updated',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/admin/all');
      })
      .catch((error) => {
        console.error('Error details:', error);
        toast({
          title: 'Error updating problem',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem({ ...problem, [name]: value });
  };

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Spinner size="xl" />
    </Box>
  );

  if (!problem) return <Box>Problem not found</Box>;

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} as="form" onSubmit={handleSubmit}>
        <Heading>Update Problem</Heading>
        <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input name="title" value={problem.title} onChange={handleChange} />
        </FormControl>
        <FormControl id="problem_statement">
          <FormLabel>Problem Statement</FormLabel>
          <Textarea 
            name="problem_statement" 
            value={problem.problem_statement} 
            onChange={handleChange}
            minHeight="150px"
          />
        </FormControl>
        <FormControl id="input_description">
          <FormLabel>Input Description</FormLabel>
          <Textarea 
            name="input_description" 
            value={problem.input_description} 
            onChange={handleChange}
            minHeight="100px"
          />
        </FormControl>
        <FormControl id="output_description">
          <FormLabel>Output Description</FormLabel>
          <Textarea 
            name="output_description" 
            value={problem.output_description} 
            onChange={handleChange}
            minHeight="100px"
          />
        </FormControl>
        <FormControl id="sample_cases">
          <FormLabel>Sample Cases</FormLabel>
          <Textarea 
            name="sample_cases" 
            value={JSON.stringify(problem.sample_cases, null, 2)} 
            onChange={(e) => setProblem({...problem, sample_cases: JSON.parse(e.target.value)})}
            minHeight="150px"
          />
        </FormControl>
        <FormControl id="constraints">
          <FormLabel>Constraints</FormLabel>
          <Textarea 
            name="constraints" 
            value={problem.constraints} 
            onChange={handleChange}
            minHeight="100px"
          />
        </FormControl>
        <FormControl id="level">
          <FormLabel>Level</FormLabel>
          <Select name="level" value={problem.level} onChange={handleChange}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Select>
        </FormControl>
        <FormControl id="hints">
          <FormLabel>Hints</FormLabel>
          <Textarea 
            name="hints" 
            value={problem.hints.join('\n')} 
            onChange={(e) => setProblem({...problem, hints: e.target.value.split('\n')})}
            minHeight="100px"
          />
        </FormControl>
        <FormControl id="topics">
          <FormLabel>Topics</FormLabel>
          <Input 
            name="topics" 
            value={problem.topics.join(', ')} 
            onChange={(e) => setProblem({...problem, topics: e.target.value.split(', ')})}
          />
        </FormControl>
        <FormControl id="locked_test_cases">
          <FormLabel>Locked Test Cases</FormLabel>
          <Textarea 
            name="locked_test_cases" 
            value={JSON.stringify(problem.locked_test_cases, null, 2)} 
            onChange={(e) => setProblem({...problem, locked_test_cases: JSON.parse(e.target.value)})}
            minHeight="150px"
          />
        </FormControl>
        <FormControl id="admin_solution">
          <FormLabel>Admin Solution</FormLabel>
          <Textarea 
            name="admin_solution" 
            value={problem.admin_solution} 
            onChange={handleChange}
            minHeight="200px"
          />
        </FormControl>
        <Button colorScheme="blue" type="submit" width="full">
          Update Problem
        </Button>
      </VStack>
    </Container>
  );
};

export default AdminUpdate;