import * as types from "../constants/action-types";
import componentApi from "../apis/componentApi";

export function loadComponents(){
    return function(dispatch) {
        return componentApi.getAllComponents()
            .then(components => {
                dispatch(loadComponentsSuccess(components));
            }).catch(error => {
                throw(error);
            });
    }
}

export function loadComponentsSuccess(components){
    return {type: types.LOAD_COMPONENTS_SUCCESS ,components};
}