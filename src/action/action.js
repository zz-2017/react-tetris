import {
    MOVE_LEFT,
    MOVE_RIGHT,
    MOVE_DOWN,
    ROTATE,
    TURN,
    MERGE,
    ELIMIMATE,
    CHANGE_MODE,
    CHANGE_UPDATE_TIME,
    CHANGE_STATE
} from './constant.js';

function actionCreator(type) {
    return function (payload) {
        if (payload) {
            return {
                type: type,
                payload: payload
            }
        } else {
            return {
                type: type
            }
        }
    }
}

export let moveLeft = actionCreator(MOVE_LEFT);
export let moveRight = actionCreator(MOVE_RIGHT);
export let moveDown = actionCreator(MOVE_DOWN);
export let rotate = actionCreator(ROTATE);
export let turn = actionCreator(TURN);
export let merge = actionCreator(MERGE);
export let eliminate = actionCreator(ELIMIMATE);
export let changeMode = actionCreator(CHANGE_MODE);
export let changeUpdateTime = actionCreator(CHANGE_UPDATE_TIME);
export let changeState = actionCreator(CHANGE_STATE);


