import { combineReducers } from 'redux';
import components from './componentReducer';

const RootReducer = combineReducers({
    components
});

export default RootReducer;