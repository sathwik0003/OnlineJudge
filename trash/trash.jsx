const express = require('express');
const mongoose = require('mongoose');
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const Problem = require('./models/Problems');


const app = express();
app.use(express.json());

mongoose.connect('YOUR_MONGODB_CONNECTION_STRING', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/run', async (req, res) => {
    const { language = "cpp", code, input } = req.body;
    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }
    try {
        const filePath = generateFile(language, code);
        const inputPath = generateInputFile(input);
        const output = await executeCpp(filePath, inputPath);
        res.json({ filePath, output });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/submit/:problemId', async (req, res) => {
    const { problemId } = req.params;
    const { language = "cpp", code } = req.body;
    
    try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, error: "Problem not found" });
        }

        const filePath = generateFile(language, code);

        for (let testCase of problem.locked_test_cases) {
            const inputPath = generateInputFile(testCase.input);
            const output = await executeCpp(filePath, inputPath);
            
            if (output.trim() !== testCase.output.trim()) {
                return res.json({ 
                    success: false, 
                    message: "Wrong Answer", 
                    failedTestCase: {
                        input: testCase.input,
                        expectedOutput: testCase.output,
                        yourOutput: output
                    }
                });
            }
        }

        // If all test cases pass
        problem.submissions += 1;
        problem.succesful += 1;
        await problem.save();

        res.json({ success: true, message: "All test cases passed!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});