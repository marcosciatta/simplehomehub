import express from 'express';
import container from '../system/dicontainer';
import ComponentController from '../controllers/componentController';
import componentRegistry from '../system/componentRegistry';

const router = express.Router();
const controller = new ComponentController();

router.route('/').get(function(req,res){
  controller.getAllComponents({type: componentRegistry.typeApplaiance})
      .then(function(components){
          res.json(components);
      })
      .catch(function(err){
              res.status(500).json(err.message);
      });
});

router.route('/:id').get(function(req,res){
    let comp_id = req.params.id;
    controller.getComponentDetail(comp_id)
        .then(function(component){
            res.json(component);
        })
        .catch(function(err){
            res.status(500).json(err.message);
        });
});


router.route('/:id/install').get( async (req,res,next) => {

  let comp_id = req.params.id;
  let componentData = await controller.getComponentDetail(comp_id);
  let component = false;

  if(!componentData) {
    return res.status(409).json({message: 'component_not_found'});
  }

  let componentRegistry = container.resolve('componentRegistry');
  try  {
      componentRegistry.installComponent(componentData.id);
      res.json('Installation launched. See debug console for required operations');
  } catch(error){
      return res.status(404).json(error.message);
  }

});


export default router;
