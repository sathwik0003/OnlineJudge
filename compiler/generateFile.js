// const fs = require('fs')
// const path = require('path')
// const {v4:uuid} = require('uuid')

// const dirCodes = path.join(__dirname,"codes")

// if(!fs.existsSync(dirCodes)){
//     fs.mkdirSync(dirCodes,{recursive: true})
// }

// const generateFile=(language, code)=>{
//     const jobId = uuid();
//     const filename = `${jobId}.${language}`;
//     const filePath = path.join(dirCodes, filename);
//     fs.writeFileSync(filePath, code);
//     return filePath;
// }

// module.exports={
//     generateFile
// }

const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (format, content) => {
    const jobId = uuid();
    const filename = `${jobId}.${format}`;
    const filepath = path.join(dirCodes, filename);
    fs.writeFileSync(filepath, content);
    return filepath;
};

module.exports = {
    generateFile
};