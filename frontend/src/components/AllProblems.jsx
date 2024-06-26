import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, SearchIcon } from '@chakra-ui/icons';
import { FaCode, FaTag, FaChartBar, FaFilter } from 'react-icons/fa';

const getDifficultyColor = (difficulty) => {
  if (!difficulty) return 'gray';
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'green';
    case 'medium': return 'orange';
    case 'hard': return 'red';
    default: return 'gray';
  }
};

const ProblemCard = ({ title, submissions, isDone, difficulty, topic }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
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
          <Badge colorScheme={getDifficultyColor(difficulty)} borderRadius="full" px={2}>
            {difficulty || 'Unknown'}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          <Icon as={FaTag} mr={1} />
          Topic: {topic || 'General'}
        </Text>
      </VStack>
    </Box>
  );
};

const AllProblems = () => {
  const sampleProblems = [
    { id: 1, title: 'Two Sum', submissions: 1000000, isDone: true, difficulty: 'Easy', topic: 'Arrays' },
    { id: 2, title: 'Add Two Numbers', submissions: 750000, isDone: false, difficulty: 'Medium', topic: 'Linked Lists' },
    { id: 3, title: 'Longest Substring Without Repeating Characters', submissions: 800000, isDone: true, difficulty: 'Medium', topic: 'Strings' },
    { id: 4, title: 'Median of Two Sorted Arrays', submissions: 500000, isDone: false, difficulty: 'Hard', topic: 'Arrays' },
    { id: 5, title: 'Longest Palindromic Substring', submissions: 600000, isDone: true, difficulty: 'Medium', topic: 'Strings' },
    { id: 6, title: 'ZigZag Conversion', submissions: 400000, isDone: false, difficulty: 'Medium', topic: 'Strings' },
    { id: 7, title: 'Reverse Integer', submissions: 950000, isDone: true, difficulty: 'Easy', topic: 'Math' },
    { id: 8, title: 'String to Integer (atoi)', submissions: 700000, isDone: false, difficulty: 'Medium', topic: 'Strings' },
    { id: 9, title: 'Palindrome Number', submissions: 850000, isDone: true, difficulty: 'Easy', topic: 'Math' },
  ];

  const [problems, setProblems] = useState(sampleProblems);
  const [filters, setFilters] = useState({
    topic: '',
    difficulty: '',
    search: '',
  });

  useEffect(() => {
    const filteredProblems = sampleProblems.filter((problem) => {
      const matchesTopic = !filters.topic || problem.topic === filters.topic;
      const matchesDifficulty = !filters.difficulty || problem.difficulty === filters.difficulty;
      const matchesSearch = !filters.search || problem.title.toLowerCase().includes(filters.search.toLowerCase());
      return matchesTopic && matchesDifficulty && matchesSearch;
    });
    setProblems(filteredProblems);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const topics = [...new Set(sampleProblems.map((p) => p.topic))].filter(Boolean);
  const difficulties = [...new Set(sampleProblems.map((p) => p.difficulty))].filter(Boolean);

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
        {problems.map((problem) => (
          <ProblemCard key={problem.id} {...problem} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AllProblems;