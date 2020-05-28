import twitter from './TwitterServer';
import { environment } from './environments/environment';

const args = require('minimist')(process.argv.slice(2));

const port = args.port || environment.port;

twitter.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`server is listening on ${port}`);
});
