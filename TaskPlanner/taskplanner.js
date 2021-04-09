const http = require("http");

const mainHtml = () => `
<html>
<head>
</head>
<body>
<h1>Welcome</h1>
</body>
</html>
`

let server = http.createServer((req, res) => {
    res.end(mainHtml());
})


function run(port=9000) {
    server.listen(port, () => console.log(`Server started on port ${port}.`));
}

/**
 * Main entry point when called from cli
 */
if (typeof require !== 'undefined' && require.main === module) {
    run();
}