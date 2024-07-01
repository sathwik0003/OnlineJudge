const express = require('express');
const {generateFile} = require("./generateFile.js")
const {executeCpp} = require("./executeCpp.js")

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res)=>{
    res.json({online:'compiler'})
})

app.post("/run",async (req,res)=>{
    const {language="cpp",code} = req.body;
    if(code===undefined){
        return res.status(400).json({success: false, message:"Empty code"})
    }

    try{
        const filePath = await generateFile(language,code);
        const output = await executeCpp(filePath);
        res.send({filePath,output})
    } catch(error){
        res.status(500).json({success: false, message:"Error:"+error})
    }

})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
