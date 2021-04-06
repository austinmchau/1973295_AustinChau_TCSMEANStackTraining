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

    debugger;

    return questions
        .reduce(
            async (response, [q, v]) => prompt(await response, q, v),
            Promise.resolve({})
        )
        .finally(() => {
            ioInterface.close();
        });
}

function logToJson(entry) {
    const fs = require("fs").promises;
    const FILEPATH = "log.json";

    // if (!(typeof entry === "object" && entry !== null)) {
    //     throw new Error(`Invalid entry: ${entry}`);
    // }

    // try {
    //     let prevData = await fs.readFile(FILEPATH);
    //     prevData = prevData.toString();
    // }


    return Promise.all([

        fs.readFile(FILEPATH)
            .then(buffer => buffer.toString())
            .then(JSON.parse)
            .then(value => (
                Array.isArray(value) ?
                    value :
                    (() => { throw new Error(`Invalid store: ${value}`) })()
            ))
            .catch(error => {
                if (error.code === 'ENOENT' || error instanceof SyntaxError) { return []; }
                throw error;
            })
        ,
        new Promise((resolve, reject) => {
            (typeof entry === "object" && entry !== null) ?
                resolve(entry) :
                reject(new Error(`Invalid entry: ${entry}`))
        })
            .then(value => ({ ...value, timestamp: new Date() }))
        ,
    ])
        .then(([fromFile, newEntry]) => [...fromFile, newEntry])
        .then(obj => JSON.stringify(obj, null, 2))
        .then(data => {
            debugger;
            return fs.writeFile(FILEPATH, data);
        })
}

/**
 * Function that asks for user info and save to json file.
 */
function logUserRecords() {

    askQuestions([
        ["Enter your first name", "firstName"],
        ["Enter your last name", "lastName"],
        ["Enter your gender", "gender"],
        ["Enter your email", "email"],
    ])
        .then((result) => {
            debugger;
            console.log(`Thanks, ${result.firstName}, your input is saved.`);
            return result;
        })
        .then(logToJson)
        .catch(error => {
            console.error(`Sorry, something wrong happened. Please try again. Error: ${error}`);
        })
}

/**
 * Exports
 */

exports.askQuestions = askQuestions;
exports.logToFile = logToJson;
exports.logUserRecords = logUserRecords;


/**
 * Main entry point when called from cli
 */
if (typeof require !== 'undefined' && require.main === module) {
    logUserRecords();
    // logToFile("Hewwo")
    //     .then(() => console.log("OK!"));

    // const fs = require("fs");
    // fs.readFile("info.txt", (error, data) => {
    //     const text = data.toString();
    //     console.log(text);
    // })
}
