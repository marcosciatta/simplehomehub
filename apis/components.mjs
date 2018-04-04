import express from 'express';
import container from '../config/dicontainer';

const router = express.Router();

router.route('/').get(function(req,res){
  let componentRegistry = container.resolve('pluginRegistry');
  res.json(componentRegistry.getComponents(componentRegistry.typeApplaiance));
});

export default router;
