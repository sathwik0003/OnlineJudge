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
