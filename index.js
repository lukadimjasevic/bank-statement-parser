const Parser = require('./models/Parser');

const parseRevolutStatement = (filePath, options = {}) => {
    const parser = new Parser(filePath, options);
    const data = parser.parse();
    return data;
};

module.exports = { parseRevolutStatement };
