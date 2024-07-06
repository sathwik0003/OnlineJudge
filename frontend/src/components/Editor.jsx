// Editor.js (React component)

import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Select, Button, Textarea, Text, useColorModeValue, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FaPlay, FaCheck, FaTimes } from 'react-icons/fa';
import AceEditor from 'react-ace';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-c_cpp'

const sampleCode = {
  javascript: `function solution(a, b) {
    return a + b;
}`,
  python: `def solution(a, b):
    return a + b`,
  java: `class Solution {
    public static int solution(int a, int b) {
        return a + b;
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`
};

const Editor = () => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(sampleCode.cpp);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [problem, setProblem] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [runtime, setRuntime] = useState(null);
  const [status, setStatus] = useState(null);
  const { problemId } = useParams();

  const authToken = Cookies.get('authToken'); 

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:2999/problemdetails/${problemId}`);
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
      setTestResults([]);
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmit = async () => {
    try {
      setOutput('Submitting code...');
      setTestResults([]);
      const response = await fetch(`http://localhost:3000/submit/${problemId}`,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ language,code })
      });
      const data = await response.json()
      if (data.success) {
        setOutput(`Submission successful: ${data.message}`);
      } else {
        setOutput(`Submission failed: ${data.status} - ${data.message}`);
      }
      setTestResults(data.results);
      setRuntime(data.runtime);
      setStatus(data.status)
    } catch (error) {
      setOutput(`Error: ${error.data?.error || error.message}`);
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
            theme={useColorModeValue('github', 'monokai')}
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

        <Box height="150px" overflowY="auto">
                    {testResults.length > 0 && (
                      <Box>
                        <Text fontWeight="bold" mb={2}>Test Results:</Text>
                        <List spacing={3}>
                          {testResults.map((result, index) => (
                            <ListItem key={index}>
                              <ListIcon as={result.passed ? FaCheck : FaTimes} color={result.passed ? "green.500" : "red.500"} />
                              Test case {result.testCase}: {result.passed ? "Passed" : "Failed"}
                              {result.error && <Text color="red.500">{result.error}</Text>}
                            </ListItem>
                          ))}
                        </List>
                        <Text mt={2}>Status: {status}</Text>
                        <Text>Runtime: {runtime} ms</Text>
                      </Box>
                    )}
                  </Box>
      </VStack>
    </Box>
  );
};

export default Editor;