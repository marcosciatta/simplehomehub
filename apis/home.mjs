import express from 'express';
import container from '../system/dicontainer';

const router = express.Router();

router.route('/devices').get(function(req,res) {
    let home = container.resolve('home');
    let devices = home.getDevices();
    let response = [];
    for ( let device of devices){
        response.push(device.toData());
    }
    console.log('response to api');

    res.json(response);
});

export default router;
