import React, { useState } from 'react';
import { Box, VStack, HStack, Select, Button, Textarea, Text, useColorModeValue } from '@chakra-ui/react';
import { FaPlay, FaCheck, FaCode } from 'react-icons/fa';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-c_cpp'

const sampleCode = {
  javascript: `function twoSum(nums, target) {
    // Your code here
}`,
  python: `def two_sum(nums, target):
    # Your code here
    pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
cpp:``
};

const Editor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(sampleCode.javascript);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(sampleCode[newLanguage]);
  };

  const handleRun = () => {
    setOutput('Running code...\nThis is a mock output. In a real application, you would execute the code and display the result here.');
  };

  const handleSubmit = () => {
    setOutput('Submitting code...\nThis is a mock submission. In a real application, you would send the code to a server for evaluation.');
  };

  const handleCustomRun = () => {
    setOutput(`Running with custom input: ${customInput}\nThis is a mock custom run. In a real application, you would execute the code with the custom input and display the result here.`);
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" bg={bgColor} borderColor={borderColor} boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <HStack justifyContent="space-between">
          <Select value={language} onChange={handleLanguageChange} width="200px" color={textColor}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </Select>
        </HStack>
        
        <Box borderWidth={1} borderRadius="md" overflow="hidden">
          <AceEditor
            mode={language}
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
          <Button leftIcon={<FaCode />} onClick={handleCustomRun}>Run Custom Input</Button>
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