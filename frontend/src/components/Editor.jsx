import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Select, Button, Textarea, Text, useColorModeValue } from '@chakra-ui/react';
import { FaPlay, FaCheck, FaCode } from 'react-icons/fa';
import AceEditor from 'react-ace';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-c_cpp'

const sampleCode = {
  javascript: `function solution(input) {
    // Your code here
}`,
  python: `def solution(input):
    # Your code here
    pass`,
  java: `class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`
};

const Editor = () => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(sampleCode.cpp);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [problem, setProblem] = useState(null);
  const { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/problems/${problemId}`);
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(sampleCode[newLanguage]);
  };

  const handleRun = async () => {
    try {
      setOutput('Running code...');
      const response = await axios.post('http://localhost:3000/run', {
        language,
        code,
        input: customInput
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmit = async () => {
    try {
      setOutput('Submitting code...');
      const response = await axios.post(`http://localhost:3000/submit/${problemId}`, {
        language,
        code
      });
      if (response.data.success) {
        setOutput(`Submission successful: ${response.data.message}`);
      } else {
        setOutput(`Submission failed: ${response.data.message}\n\nFailed Test Case:\nInput: ${response.data.failedTestCase.input}\nExpected Output: ${response.data.failedTestCase.expectedOutput}\nYour Output: ${response.data.failedTestCase.yourOutput}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" bg={bgColor} borderColor={borderColor} boxShadow="lg">
      {problem && (
        <VStack align="stretch" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">{problem.title}</Text>
          <Text>{problem.problem_statement}</Text>
        </VStack>
      )}
      <VStack spacing={6} align="stretch">
        <HStack justifyContent="space-between">
          <Select value={language} onChange={handleLanguageChange} width="200px" color={textColor}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </Select>
        </HStack>
        
        <Box borderWidth={1} borderRadius="md" overflow="hidden">
          <AceEditor
            mode={language === 'cpp' ? 'c_cpp' : language}
            theme={useColorModeValue('chrome', 'monokai')}
            onChange={setCode}
            value={code}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            width="100%"
            height="400px"
            fontSize={16}
          />
        </Box>
        
        <HStack>
          <Button leftIcon={<FaPlay />} colorScheme="green" onClick={handleRun}>Run</Button>
          <Button leftIcon={<FaCheck />} colorScheme="blue" onClick={handleSubmit}>Submit</Button>
        </HStack>
        
        <Box>
          <Text fontWeight="bold" mb={2} color={textColor}>Custom Input:</Text>
          <Textarea 
            value={customInput} 
            onChange={(e) => setCustomInput(e.target.value)} 
            placeholder="Enter custom input here"
            bg={inputBgColor}
            color={textColor}
            mb={2}
          />
        </Box>
        
        <Box>
          <Text fontWeight="bold" mb={2} color={textColor}>Output:</Text>
          <Box p={4} borderWidth={1} borderRadius="md" bg={inputBgColor}>
            <Text fontFamily="monospace" whiteSpace="pre-wrap" color={textColor}>{output}</Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Editor;