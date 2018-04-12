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
    res.json(response);
});

router.route('/device/:id').get(function(req,res){
    let home = container.resolve('home');
    let device_id = req.params.id;
    let device = home.getDevice(device_id);
    if(device){
        return res.json(device.toData());
    }
    res.status(404).json({message: 'device not found'});
});

router.route('/device/:id/change_state').patch(function(req,res){
    var identity =req.params.id;
    var operation = req.body.state;

    let home = container.resolve('home');
    let device = home.getDevice(identity);
    if(!device){
        return res.status(404).json({message: 'device not found'});
    }
    home.changeDeviceStateTo(identity,operation);
    res.json('Command sended');
});


export default router;
