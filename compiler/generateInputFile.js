// const fs = require('fs');
// const path = require('path');
// const { v4: uuid } = require('uuid');

// const dirInputs = path.join(__dirname, 'inputs');

// if (!fs.existsSync(dirInputs)) {
//     fs.mkdirSync(dirInputs, { recursive: true });
// }

// const generateInputFile = async (input) => {
//     const jobID = uuid();
//     const input_filename = `${jobID}.txt`;
//     const input_filePath = path.join(dirInputs, input_filename);
//     await fs.writeFileSync(input_filePath, input);
//     return input_filePath;
// };

// module.exports = {
//     generateInputFile,
// };


const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = (input) => {
    const jobId = uuid();
    const filename = `${jobId}.txt`;
    const filepath = path.join(dirInputs, filename);
    fs.writeFileSync(filepath, input);
    return filepath;
};

module.exports = {
    generateInputFile
};