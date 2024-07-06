import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Select,
  Flex,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  Spinner,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, SearchIcon } from '@chakra-ui/icons';
import { FaCode, FaTag, FaChartBar, FaFilter } from 'react-icons/fa';
import Cookies from 'js-cookie';

const getDifficultyColor = (difficulty) => {
  if (!difficulty) return 'gray';
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'green';
    case 'medium': return 'orange';
    case 'hard': return 'red';
    default: return 'gray';
  }
};

const ProblemCard = ({ _id, title, submissions, succesful, level, topics, onClick }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const isDone = succesful > 0;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg', cursor: 'pointer' }}
      onClick={() => onClick(_id)}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg" isTruncated>
            <Icon as={FaCode} mr={2} color="blue.500" />
            {title}
          </Text>
          <Icon
            as={isDone ? CheckCircleIcon : WarningIcon}
            color={isDone ? 'green.500' : 'orange.500'}
            w={6}
            h={6}
          />
        </HStack>
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.500">
            <Icon as={FaChartBar} mr={1} />
            Submissions: {submissions}
          </Text>
          <Badge colorScheme={getDifficultyColor(level)} borderRadius="full" px={2}>
            {level || 'Unknown'}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          <Icon as={FaTag} mr={1} />
          Topics: {topics.join(', ') || 'General'}
        </Text>
      </VStack>
    </Box>
  );
};

const AllProblems = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    topic: '',
    difficulty: '',
    search: '',
  });
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken'); 


  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:2999/api/problems');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProblems(data);
        } else {
          throw new Error('Data received is not an array');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Error fetching problems. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesTopic = !filters.topic || problem.topics.includes(filters.topic);
    const matchesDifficulty = !filters.difficulty || problem.level === filters.difficulty;
    const matchesSearch = !filters.search || problem.title.toLowerCase().includes(filters.search.toLowerCase());
    return matchesTopic && matchesDifficulty && matchesSearch;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleProblemClick = (problemId) => {
    navigate(`/user/problemeditor/${problemId}`);
  };

  const topics = [...new Set(problems.flatMap((p) => p.topics))].filter(Boolean);
  const difficulties = [...new Set(problems.map((p) => p.level))].filter(Boolean);

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box>
      <Flex mb={6} flexWrap="wrap" gap={4}>
        <Select
          name="topic"
          placeholder="Filter by Topic"
          onChange={handleFilterChange}
          value={filters.topic}
          w={{ base: '100%', md: 'auto' }}
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </Select>
        <Select
          name="difficulty"
          placeholder="Filter by Difficulty"
          onChange={handleFilterChange}
          value={filters.difficulty}
          w={{ base: '100%', md: 'auto' }}
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>{difficulty}</option>
          ))}
        </Select>
        <InputGroup w={{ base: '100%', md: 'auto' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            name="search"
            placeholder="Search problems"
            onChange={handleFilterChange}
            value={filters.search}
          />
        </InputGroup>
        <Button
          leftIcon={<Icon as={FaFilter} />}
          onClick={() => setFilters({ topic: '', difficulty: '', search: '' })}
          colorScheme="blue"
        >
          Clear Filters
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem._id} {...problem} onClick={handleProblemClick} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AllProblems;