const express = require('express');
const mongoose = require('mongoose')
const {generateFile} = require("./generateFile.js")
const {executeCpp} = require("./executeCpp.js")
const {generateInputFile} = require('./generateInputFile.js')
const cors = require('cors');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./database/db.js')
const Problem = require('./models/Problems.js')
const User = require('./models/Users.js')
const UserProblem = require('./models/UserProblem.js')

dotenv.config({
    path: './.env'
});

connectDB();



const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.get("/",(req,res)=>{
    res.json({online:'compiler'})
})

function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log("Access denied. No token provided.");
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Invalid token", error);
        res.status(400).send("Invalid token");
    }
}

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

app.post('/submit/:problemId', authenticateToken, async (req, res) => {
    const { problemId } = req.params;
    const { language = "cpp", code } = req.body;
    const userId = req.user.userId;
    console.log(userId)
    
    try {
      const problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ success: false, error: "Problem not found" });
      }
  
      const filePath = generateFile(language, code);
      let results = [];
      let allPassed = true;
      let totalRuntime = 0;
      let status = 'Accepted';
      const timeLimit = 10;
  try{
      for (let i = 0; i < problem.locked_test_cases.length; i++) {
        const testCase = problem.locked_test_cases[i];
        const inputPath = generateInputFile(testCase.input);
        const startTime = process.hrtime();
        const output = await executeCpp(filePath, inputPath, timeLimit);
        console.log(output);
        const endTime = process.hrtime(startTime);
        const testRuntime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
        totalRuntime += testRuntime;
        
        const passed = output.trim() === testCase.output.trim();
        results.push({ testCase: i + 1, passed, runtime: testRuntime.toFixed(2) });
        if (!passed){
          allPassed = false;
          status = 'Wrong Answer';
        }
      }
    }
    catch (error) {
      allPassed = false;
      if (error.type === 'SyntaxError') {
        status = 'Syntax Error';
        results = [{ error: error.error }];
      } else if (error.type === 'CompilationError') {
        status = 'Compilation Error';
        results = [{ error: error.error }];
      } else if (error.type === 'TimeLimitExceeded') {
        status = 'Time Limit Exceeded';
        results.push({
          testCase: results.length + 1,
          passed: false,
          error: 'Time Limit Exceeded'
        });
      } else {
        status = 'Runtime Error';
        results.push({
          testCase: results.length + 1,
          passed: false,
          error: error.error
        });
      }
    }
      // Create a new UserProblem document for each submission
      const newSubmission = new UserProblem({
        user: userId,
        problem: problemId,
        status,
        code,
        language,
        submittedAt: new Date()
      });
      
      await newSubmission.save();
      problem.submissions += 1;
      if (allPassed) {
        problem.succesful += 1;
      }
      await problem.save();
  
      res.json({ 
        success: allPassed, 
        message: allPassed ? "All test cases passed!" : `submission failed: ${status}`,
        results,
        runtime: totalRuntime.toFixed(2),
        status
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API to get particular user submissions
app.get('/user/submissions', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const submissions = await UserProblem.find({ user: userId })
        .populate('problem', 'title')
        .select('-code')
        .sort('-submittedAt')
        .skip(skip)
        .limit(limit);
      
      const total = await UserProblem.countDocuments({ user: userId });
      
      res.json({ 
        success: true, 
        submissions,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubmissions: total
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  
  // API to get particular problem submissions
  app.get('/problem/:problemId/submissions', async (req, res) => {
    try {
      const { problemId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const submissions = await UserProblem.find({ problem: problemId })
        .populate('user', 'username')
        .select('-code')
        .sort('-submittedAt')
        .skip(skip)
        .limit(limit);
      
      const total = await UserProblem.countDocuments({ problem: problemId });
      
      res.json({ 
        success: true, 
        submissions,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubmissions: total
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
