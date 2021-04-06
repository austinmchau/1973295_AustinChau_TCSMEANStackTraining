/**
 * Function that asks an array of questions and returns a Promise of user response.
 * @param {[string, string][]} questions Array of tuple of [the question to ask, variable name for the response.]
 * @param {readline.ReadLineOptions | undefined} interface optional configuration for the readline.
 * @returns {Promise<{[varName: string]: string}>} A Promise that returns and object of {[variable name from questions]: response}
 */
function askQuestions(questions, interface) {

    const readline = require("readline");

    const ioInterface = readline.createInterface(interface ?? {
        input: process.stdin,
        output: process.stdout,
    });

    const prompt = (acc, question, varName) => new Promise((resolve) => {
        ioInterface.question(`${question}: `, (response) => {
            resolve({ ...acc, [varName]: response });
        })
    });

    return questions
        .reduce(
            async (response, [q, v]) => prompt(await response, q, v),
            Promise.resolve({})
        )
        .finally(() => {
            ioInterface.close();
        });
}

function logToFile(entry) {

}

/**
 * Function that asks for user info and save to json file.
 */
function logUserRecords() {

    const userInput = askQuestions([
        ["Enter your first name", "firstName"],
        ["Enter your last name", "lastName"],
        ["Enter your gender", "gender"],
        ["Enter your email", "email"],
    ])
        .then((result) => {
            console.log(`Thanks, ${result.firstName}, your input is saved.`);
            return result;
        })
        .catch(error => {
            console.error(`Sorry, something wrong happened. Please try again. Error: ${error}`);
        })
}

/**
 * Exports
 */

exports.askQuestions = askQuestions;
exports.logToFile = logToFile;
exports.logUserRecords = logUserRecords;


/**
 * Main entry point when called from cli
 */
if (typeof require !== 'undefined' && require.main === module) {
    logUserRecords();
}
