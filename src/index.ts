import twitter from './TwitterServer';
var argv = require('minimist')(process.argv.slice(2));

const port = argv.port || 8000;

twitter.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    return console.log(`server is listening on ${port}`);
});
