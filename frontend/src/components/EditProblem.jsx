import React, { useState } from 'react';
import { Box, Button, HStack, VStack, useColorModeValue } from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaCode } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Problem from './Problem'
import Editor from './Editor';


const EditProblem = () => {
  const [showProblem, setShowProblem] = useState(true);
  const [showEditor, setShowEditor] = useState(true);

  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [outputDescription, setOutputDescription] = useState("");
  const [sampleCases, setSampleCases] = useState([{ sample_input: "", sample_output: "" }]);
  const [constraints, setConstraints] = useState("");
  const [hints, setHints] = useState([{ hints: "" }]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topics, setTopics] = useState([''])
  const bgColor = useColorModeValue('gray.50', 'gray.900');





  return (
    <Box p={[4, 6, 8]} bg={bgColor} minHeight="100vh">
      <VStack spacing={6} align="stretch" maxWidth="1200px" margin="0 auto">
        <HStack spacing={4} justifyContent="center" wrap="wrap">
          <Button
            leftIcon={showProblem ? <FaEyeSlash /> : <FaEye />}
            onClick={() => setShowProblem(!showProblem)}
            colorScheme="teal"
          >
            {showProblem ? 'Hide Problem' : 'Show Problem'}
          </Button>
          <Button
            leftIcon={showEditor ? <FaEyeSlash /> : <FaCode />}
            onClick={() => setShowEditor(!showEditor)}
            colorScheme="purple"
          >
            {showEditor ? 'Hide Editor' : 'Show Editor'}
          </Button>
        </HStack>
        
        <HStack align="start" spacing={6} wrap={["wrap", "wrap", "nowrap"]}>
          {showProblem && (
            <Box flex={1} width={["100%", "100%", "50%"]}>
              <Problem />
            </Box>
          )}
          {showEditor && (
            <Box flex={1} width={["100%", "100%", "50%"]}>
              <Editor />
            </Box>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default EditProblem;