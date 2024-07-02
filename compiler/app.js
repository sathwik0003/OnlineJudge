const express = require('express');
const mongoose = require('mongoose')
const {generateFile} = require("./generateFile.js")
const {executeCpp} = require("./executeCpp.js")
const {generateInputFile} = require('./generateInputFile.js')
const cors = require('cors');
const dotenv = require('dotenv')
const connectDB = require('../backend/database/db.js')
const Problem = require('../backend/models/Problems.js')

dotenv.config({
    path: '../backend/.env'
});

connectDB();



const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.get("/",(req,res)=>{
    res.json({online:'compiler'})
})

app.post("/run",async (req,res)=>{
    const {language="cpp",code,input} = req.body;
    if(code===undefined){
        return res.status(400).json({success: false, message:"Empty code"})
    }

    try{
        const filePath = await generateFile(language,code);
        const inputPath = await generateInputFile(input);
        const output = await executeCpp(filePath,inputPath);
        res.send({filePath,inputPath,output})
    } catch(error){
        res.status(500).json({success: false, message:"Error:"+error})
    }

})

;


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
        let results = [];
        let allPassed = true;

        for (let i = 0; i < problem.locked_test_cases.length; i++) {
            const testCase = problem.locked_test_cases[i];
            const inputPath = generateInputFile(testCase.input);
            const output = await executeCpp(filePath, inputPath);
            
            const passed = output.trim() === testCase.output.trim();
            results.push({ testCase: i + 1, passed });
            if (!passed) allPassed = false;
        }

        if (allPassed) {
            problem.submissions += 1;
            problem.succesful += 1;
            await problem.save();
        }

        res.json({ 
            success: allPassed, 
            message: allPassed ? "All test cases passed!" : "Some test cases failed.",
            results
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
