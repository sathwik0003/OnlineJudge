const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
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
    origin: 'https://www.algosprint.online', 
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
        const timeLimit = 10;
        const output = await executeCpp(filePath,inputPath,timeLimit);
        res.send({filePath,inputPath,output})
    } catch(error){
        res.status(500).json({success: false, message:"Error:"+error})
    }

})

;




app.post('/submit/:problemId', authenticateToken, async (req, res) => {
    const { problemId } = req.params;
    const { language = "cpp", code } = req.body;
    const userId = req.user.userId;
    
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




  app.get('/user/statistics', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const totalProblems = await Problem.countDocuments();
  
      const solvedProblemsSet = new Set(
        await UserProblem.distinct('problem', { user: userId, status: 'Accepted' })
      );
      const solvedProblems = solvedProblemsSet.size;

  
      const submissions = await UserProblem.find({ user: userId })
        .sort('-submittedAt')
        .limit(5)
        .populate('problem', 'title');
  
      const userSubmissions = await UserProblem.find({ user: userId, status: 'Accepted' })
        .sort('submittedAt');

  
      let currentStreak = 0;
      let maxStreak = 0;
      let streakData = [];
      let lastDate = null;
  
      userSubmissions.forEach(submission => {
        const currentDate = submission.submittedAt.toISOString().split('T')[0];
        if (lastDate) {
          const lastDateObj = new Date(lastDate);
          const currentDateObj = new Date(currentDate);
          const diffDays = (currentDateObj - lastDateObj) / (1000 * 60 * 60 * 24);
  
          if (diffDays === 1) {
            currentStreak++;
          } else if (diffDays > 1) {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
        lastDate = currentDate;
        streakData.push({ date: currentDate, streak: currentStreak });
      });
  
      maxStreak = Math.max(maxStreak, currentStreak);
  
  
      res.json({
        success: true,
        totalProblems,
        solvedProblems,
        submissions,
        currentStreak,
        maxStreak,
        streakData
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/user/all-submissions', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const allSubmissions = await UserProblem.find({ user: userId })
        .sort('-submittedAt')
        .populate('problem', 'title');
  
      res.json({
        success: true,
        submissions: allSubmissions
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  
  
  
  app.get('/user/monthly-stats', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const year = new Date().getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year + 1, 0, 1);
  
      const monthlyData = await UserProblem.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: 'Accepted',
            submittedAt: { $gte: startOfYear, $lt: endOfYear }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$submittedAt' },
              problem: '$problem'
            },
            firstSolved: { $min: '$submittedAt' }
          }
        },
        {
          $group: {
            _id: '$_id.month',
            uniqueProblems: { $sum: 1 },
            problems: {
              $push: {
                problemId: '$_id.problem',
                solvedAt: '$firstSolved'
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      const formattedData = monthlyData.map(item => ({
        month: new Date(year, item._id - 1, 1).toLocaleString('default', { month: 'long' }),
        uniqueProblemCount: item.uniqueProblems,
        problems: item.problems
      }));
  
      res.json({ success: true, monthlyData: formattedData });
    } catch (err) {
      console.error('Error in monthly stats:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });


 

app.get('/user/topic-stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;


    const topicStats = await Problem.aggregate([
      {
        $lookup: {
          from: 'userproblems',
          let: { problemId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$problem', '$$problemId'] },
                    { $eq: ['$user', new ObjectId(userId)] },
                    { $eq: ['$status', 'Accepted'] }
                  ]
                }
              }
            }
          ],
          as: 'solved'
        }
      },
      {
        $unwind: '$topics'
      },
      {
        $group: {
          _id: '$topics',
          total: { $sum: 1 },
          solved: { $sum: { $cond: [{ $gt: [{ $size: '$solved' }, 0] }, 1, 0] } }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({ success: true, topicStats });
  } catch (err) {
    console.error('Error in topic stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



