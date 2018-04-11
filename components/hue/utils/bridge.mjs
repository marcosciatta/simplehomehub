import huejay from 'huejay';
import readline from 'readline';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export default class Bridge {

    constructor(logger,deviceType)
    {
        this.logger = logger;
        this.deviceType = deviceType;
    }

    discovery(){
        this.logger.debug('Starting brige installation...');
        return huejay.discover()
            .then(bridges => {
                for (let bridge of bridges) {
                    return bridge;
                }
            })
            .catch(error => {
                this.logger.info(`An error occurred: ${error.message}`);
            });
    }

    getUser(client){
        return client.users.get()
            .then(user => {
                return user;
            });
    }

    createUser(client){
        let user = new client.users.User;
        user.deviceType = this.deviceType;
        return client.users.create(user)
            .then(user => {
                console.log(`New user created - Username: ${user.username}`);
                return user;
            }).catch(error => {
                if (error instanceof huejay.Error && error.type === 101) {
                    return console.log(`Link button not pressed. Try again...`);
            }});
    }

    waitUserConfirm() {
        return new Promise((resolve) => {
            rl.question('Please press button on bridge ... ', (done) => { resolve(done) })
        });
    }


}