import * as types from '../constants/action-types';
import initialState from './initialState';

export default function componentReducer(state = initialState.components, action){
    switch(action.type){
        case types.LOAD_COMPONENTS_SUCCESS:
            return action.components;
        default:
            console.log('return default state');
            console.log(state);
            return state;
    }
}