import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  Heading,
  VStack,
  HStack,
  IconButton,
  Container,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const AddProblem = () => {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [outputDescription, setOutputDescription] = useState("");
  const [sampleCases, setSampleCases] = useState([{ sample_input: "", sample_output: "" }]);
  const [constraints, setConstraints] = useState("");
  const [hints, setHints] = useState([{ hints: "" }]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [lockedTestCases, setLockedTestCases] = useState([
    { input: "", output: "" },
  ]);
  const [adminSolution, setAdminSolution] = useState({
    code: "",
    language: "",
  });
  const [level, setLevel] = useState("");

  const [allTopics, setAllTopics] = useState([
    "Arrays",
    "Strings",
    "Linked Lists",
    "Stacks",
    "Queues",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Sorting",
    "Searching",
    "Recursion",
    "Backtracking",
    "Basic Math",
    "Input/Output",
  ]);

  const programmingLanguages = [
    "Python",
    "JavaScript",
    "Java",
    "C++",
    "C",
  ];

  const difficultyLevels = ["Easy", "Medium", "Hard"];

  const toast = useToast();

  const handleAddSampleCase = () => {
    setSampleCases([...sampleCases, { sample_input: "", sample_output: "" }]);
  };

  const handleRemoveSampleCase = (index) => {
    const newSampleCases = sampleCases.filter((_, i) => i !== index);
    setSampleCases(newSampleCases);
  };

  const handleAddHint = () => {
    setHints([...hints, { hints: "" }]);
  };

  const handleRemoveHint = (index) => {
    const newHints = hints.filter((_, i) => i !== index);
    setHints(newHints);
  };

  const handleAddLockedTestCase = () => {
    setLockedTestCases([...lockedTestCases, { input: "", output: "" }]);
  };

  const handleRemoveLockedTestCase = (index) => {
    const newLockedTestCases = lockedTestCases.filter((_, i) => i !== index);
    setLockedTestCases(newLockedTestCases);
  };

  const handleTopicSelect = (topic) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleRemoveTopic = (topic) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProblem = {
      title,
      problem_statement: problemStatement,
      input_description: inputDescription,
      output_description: outputDescription,
      sample_cases: sampleCases,
      constraints,
      hints,
      topics: selectedTopics,
      locked_test_cases: lockedTestCases,
      admin_solution: adminSolution,
      level,
    };

    try {
      const response = await fetch("http://localhost:2999/addproblem", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProblem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: "Problem added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error adding problem",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  return (
    <Container maxW="container.xl" py={8}>
      <Box bg={bgColor} shadow="md" borderRadius="lg" p={6}>
        <Heading mb={6}>Add New Problem</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl id="level" isRequired>
              <FormLabel>Difficulty Level</FormLabel>
              <Select
                placeholder="Select difficulty level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {difficultyLevels.map((level) => (
                  <option key={level} value={level.toLowerCase()}>
                    {level}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="problem_statement" isRequired>
              <FormLabel>Problem Statement</FormLabel>
              <Textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                minHeight="200px"
              />
            </FormControl>

            <FormControl id="input_description" isRequired>
              <FormLabel>Input Description</FormLabel>
              <Textarea
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
              />
            </FormControl>

            <FormControl id="output_description" isRequired>
              <FormLabel>Output Description</FormLabel>
              <Textarea
                value={outputDescription}
                onChange={(e) => setOutputDescription(e.target.value)}
              />
            </FormControl>

            <FormControl id="sample_cases" isRequired>
              <FormLabel>Sample Cases</FormLabel>
              {sampleCases.map((sampleCase, index) => (
                <HStack key={index} spacing={2} mt={2}>
                  <Input
                    placeholder="Sample Input"
                    value={sampleCase.sample_input}
                    onChange={(e) => {
                      const newSampleCases = [...sampleCases];
                      newSampleCases[index].sample_input = e.target.value;
                      setSampleCases(newSampleCases);
                    }}
                  />
                  <Input
                    placeholder="Sample Output"
                    value={sampleCase.sample_output}
                    onChange={(e) => {
                      const newSampleCases = [...sampleCases];
                      newSampleCases[index].sample_output = e.target.value;
                      setSampleCases(newSampleCases);
                    }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleRemoveSampleCase(index)}
                    aria-label="Remove sample case"
                  />
                </HStack>
              ))}
              <Button
                leftIcon={<AddIcon />}
                mt={2}
                onClick={handleAddSampleCase}
              >
                Add Sample Case
              </Button>
            </FormControl>

            <FormControl id="constraints" isRequired>
              <FormLabel>Constraints</FormLabel>
              <Textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </FormControl>

            <FormControl id="hints">
              <FormLabel>Hints</FormLabel>
              {hints.map((hint, index) => (
                <HStack key={index} mt={2}>
                  <Input
                    placeholder="Hint"
                    value={hint.hints}
                    onChange={(e) => {
                      const newHints = [...hints];
                      newHints[index].hints = e.target.value;
                      setHints(newHints);
                    }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleRemoveHint(index)}
                    aria-label="Remove hint"
                  />
                </HStack>
              ))}
              <Button leftIcon={<AddIcon />} mt={2} onClick={handleAddHint}>
                Add Hint
              </Button>
            </FormControl>

            <FormControl id="topics" isRequired>
              <FormLabel>Topics</FormLabel>
              <Select
                placeholder="Select topics"
                onChange={(e) => handleTopicSelect(e.target.value)}
              >
                {allTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </Select>
              <Flex mt={2} flexWrap="wrap">
                {selectedTopics.map((topic) => (
                  <Tag
                    key={topic}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                    m={1}
                  >
                    <TagLabel>{topic}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTopic(topic)} />
                  </Tag>
                ))}
              </Flex>
            </FormControl>

            <FormControl id="locked_test_cases" isRequired>
              <FormLabel>Locked Test Cases</FormLabel>
              {lockedTestCases.map((testCase, index) => (
                <HStack key={index} spacing={2} mt={2}>
                  <Input
                    placeholder="Locked Input"
                    value={testCase.input}
                    onChange={(e) => {
                      const newLockedTestCases = [...lockedTestCases];
                      newLockedTestCases[index].input = e.target.value;
                      setLockedTestCases(newLockedTestCases);
                    }}
                  />
                  <Input
                    placeholder="Locked Output"
                    value={testCase.output}
                    onChange={(e) => {
                      const newLockedTestCases = [...lockedTestCases];
                      newLockedTestCases[index].output = e.target.value;
                      setLockedTestCases(newLockedTestCases);
                    }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleRemoveLockedTestCase(index)}
                    aria-label="Remove locked test case"
                  />
                </HStack>
              ))}
              <Button
                leftIcon={<AddIcon />}
                mt={2}
                onClick={handleAddLockedTestCase}
              >
                Add Locked Test Case
              </Button>
            </FormControl>

            <FormControl id="admin_solution" isRequired>
              <FormLabel>Admin Solution</FormLabel>
              <Textarea
                placeholder="Solution Code"
                value={adminSolution.code}
                onChange={(e) =>
                  setAdminSolution({ ...adminSolution, code: e.target.value })
                }
                minHeight="200px"
              />
              <Select
                mt={2}
                placeholder="Select Language"
                value={adminSolution.language}
                onChange={(e) =>
                  setAdminSolution({
                    ...adminSolution,
                    language: e.target.value,
                  })
                }
              >
                {programmingLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg">
              Submit Problem
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default AddProblem;