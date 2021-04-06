/**
 * Function that asks an array of questions and returns a Promise of user response.
 * @param {[string, string][]} questions Array of tuple of [the question to ask, variable name for the response.]
 * @param {readline.ReadLineOptions | undefined} interface optional configuration for the readline.
 * @returns {Promise<{[varName: string]: string}>} A Promise that returns and object of {[variable name from questions]: response}
 */
async function askQuestions(questions, interface) {

    const readline = require("readline");

    const ioInterface = readline.createInterface(interface ?? {
        input: process.stdin,
        output: process.stdout,
    });

    // A promise factory to generate a promise for every question prompt
    const prompt = (acc, question, varName) => new Promise((resolve) => {
        ioInterface.question(`${question}: `, (response) => {
            resolve({ ...acc, [varName]: response });
        })
    });

    debugger;

    return questions
        .reduce(  // map the questions into promise while building a result object
            async (response, [q, v]) => prompt(await response, q, v),
            Promise.resolve({})
        )
        .finally(() => {  // always close the readline
            ioInterface.close();
        });
}

/**
 * Function to append-log the user entry into the json file. 
 * @param {[varName: string]: string} entry user's input to be stored. 
 * @returns Promise that's fulfilled after a successful write.
 */
async function logToJson(entry) {
    const fs = require("fs").promises;
    const FILEPATH = "log.json";

    /**
     * a promise function that reads existing entries from the log
     * @returns A promise with the existing entries
     */
    const readFile = async () => {
        try {
            const buffer = await fs.readFile(FILEPATH);
            const bufferString = buffer.toString();
            const prevEntries = JSON.parse(bufferString);
            if (!(Array.isArray(prevEntries))) { throw new Error(`Invalid store: ${prevEntries}`); }
            return prevEntries;
        } catch (error) {
            if (error.code === 'ENOENT' || error instanceof SyntaxError) { return []; }
            throw error;
        }
    }
    /**
     * a promise function that validates the user input object and add timestamp
     * @returns the user input with timestamp
     */
    const validateEntry = async () => {
        if (!(typeof entry === "object" && entry !== null)) { throw new Error(`Invalid entry: ${entry}`); }
        return { ...entry, timestamp: new Date() };
    }

    // execute both promises
    const [fromFile, newEntry] = await Promise.all([readFile(), validateEntry(),]);
    // append and create new log
    const payload = [...fromFile, newEntry];
    const data = JSON.stringify(payload, null, 2);
    debugger;
    // write to log
    return await fs.writeFile(FILEPATH, data);
}

/**
 * Function that asks for user info and save to json file.
 */
async function logUserRecords() {

    // ask for user input
    const userInput = await askQuestions([
        ["Enter your first name", "firstName"],
        ["Enter your last name", "lastName"],
        ["Enter your gender", "gender"],
        ["Enter your email", "email"],
    ])
    console.log(`Thanks, ${userInput.firstName}, your input is saved.`);
    debugger;

    try {
        // save to json log
        await logToJson(userInput);
    } catch (error) {
        console.error(`Sorry, something wrong happened. Please try again. Error: ${error}`);
    }
}

/**
 * Exports. Functions that would be needed for this file to be reusable.
 */

exports.askQuestions = askQuestions;
exports.logToFile = logToJson;
exports.logUserRecords = logUserRecords;


/**
 * Main entry point when called from cli
 */
if (typeof require !== 'undefined' && require.main === module) {
    logUserRecords();
}
