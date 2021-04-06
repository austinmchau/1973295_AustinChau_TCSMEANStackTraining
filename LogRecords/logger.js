let readline = require("readline");

let getIo = () => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * 
 * @param {readline.Interface} ioInterface 
 * @param {[string, string][]} questions 
 * @returns {Promise<{[varName: string]: string}>}
 */
function askQuestions(ioInterface, questions) {

    const prompt = (acc, question, varName) => new Promise((resolve) => {
        ioInterface.question(`${question}: `, (response) => {
            resolve({ ...acc, [varName]: response });
        })
    });

    return questions
        .reduce(
            async (response, [q, v]) => prompt(await response, q, v),
            Promise.resolve()
        )
        .finally(() => {
            ioInterface.close();
        });
}


askQuestions(getIo(), [
    ["Enter your first name", "firstName"],
    ["Enter your last name", "lastName"],
])
    .then(results => {
        console.log(results);
    });
