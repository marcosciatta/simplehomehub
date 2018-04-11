import mongoose from 'mongoose';

const componentSchema = mongoose.Schema({
   id: String,
   name: String,
   installed: {
      type: Boolean,
      default: false
   },
   installed_at: {
       type: Date
   },
   type: String,
   last_seen: {
       type: Date,
       default: Date.now
   }
});

const componentModel = mongoose.model('ComponentModel', componentSchema);
export { componentModel as default, componentSchema }