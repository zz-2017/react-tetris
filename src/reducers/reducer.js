import { detectionOfActive, detectionOfEnd } from '../detection/detection.js';
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
    CHANGE_STATE,
    READY,
    END
} from '../action/constant.js';

export default function tetrisReducer(perState = {}, action) {
    if (perState.state === END) {
        perState = {};
    }
    switch (action.type) {
        case MERGE:
            let nextResidueBlocks = perState.residueBlocks.concat(perState.activeTetris.matrix).sort(sortRule);
            let state = detectionOfEnd(perState.account, nextResidueBlocks) ? END : perState.state;
            return {
                activeTetris: perState.nextTetris,
                residueBlocks: nextResidueBlocks,
                nextTetris: getNextTetris(),
                account: perState.account,
                mode: perState.mode,
                updateTime: perState.updateTime,
                state: state
            };
        case ELIMIMATE:
            let newResidueBlocks = [...perState.residueBlocks];
            let newAccount = perState.account;
            let singArray = [];
            let sign = null;
            let count = -1;
            for (let i = 0, residueBlocks = perState.residueBlocks; i < residueBlocks.length; i++) {
                if (residueBlocks[i].x === 0) {
                    sign = i;
                    count = 0;
                } else if (sign) {
                    if (residueBlocks[i].x === (count + 1)) {
                        count = count + 1;
                        if (count === 14) {
                            singArray.push(sign);
                            sign = null;
                            count = -1;
                        }
                    } else {
                        sign = null;
                        count = -1;
                    }
                }
            }
            if (singArray.length > 0) {
                newAccount = newAccount + singArray.length;
                for (let i = (singArray.length - 1); i >= 0; i--) {
                    newResidueBlocks.splice(singArray[i], 15);
                    for (let n = 0; n < singArray[i]; n++) {
                        newResidueBlocks[n].y = newResidueBlocks[n].y + 1;
                    }
                }
                newResidueBlocks.sort(sortRule);
            } else {
                newResidueBlocks = perState.residueBlocks;
            }
            let newState = detectionOfEnd(newAccount, newResidueBlocks) ? END : perState.state;
            return {
                activeTetris: perState.activeTetris,
                residueBlocks: newResidueBlocks,
                nextTetris: perState.nextTetris,
                account: newAccount,
                mode: perState.mode,
                updateTime: perState.updateTime,
                state: newState
            };
        default:
            return {
                activeTetris: activeTetrisReducer(perState, action),
                residueBlocks: perState.residueBlocks ? perState.residueBlocks : [],
                nextTetris: perState.nextTetris ? perState.nextTetris : getNextTetris(),
                account: perState.account ? perState.account : 0,
                mode: modeReducers(perState.mode, action),
                updateTime: updateTimeReducer(perState.updateTime, action),
                state: stateReducers(perState.state, action)
            };
    }
}

function updateTimeReducer(perState, action) {
    switch (action.type) {
        case CHANGE_UPDATE_TIME:
            return action.payload.updateTime;
        default:
            return perState ? perState : 1000
    }
}

function activeTetrisReducer(perState, action) {
    if (perState.activeTetris === undefined) {
        return getNextTetris();
    }
    let activeTetrisMatrix = perState.activeTetris.matrix;
    let residueBlocks = perState.residueBlocks;
    switch (action.type) {
        case MOVE_LEFT:
            activeTetrisMatrix = activeTetrisMatrix.map((item) => ({
                x: item.x - 1,
                y: item.y,
                color: item.color
            }));
            return detectionOfActive(activeTetrisMatrix, residueBlocks) ? {
                matrix: activeTetrisMatrix
            } : perState.activeTetris;

        case MOVE_RIGHT:
            activeTetrisMatrix = activeTetrisMatrix.map((item) => ({
                x: item.x + 1,
                y: item.y,
                color: item.color
            }));
            return detectionOfActive(activeTetrisMatrix, residueBlocks) ? {
                matrix: activeTetrisMatrix
            } : perState.activeTetris;

        case MOVE_DOWN:
            activeTetrisMatrix = activeTetrisMatrix.map((item) => ({
                x: item.x,
                y: item.y + 1,
                color: item.color
            }));
            return detectionOfActive(activeTetrisMatrix, residueBlocks) ? {
                matrix: activeTetrisMatrix
            } : perState.activeTetris;

        case ROTATE:
            let origin = activeTetrisMatrix[2];
            //旋转算法
            //第一步: 将原来的坐标转系换成以第一个item为原点的坐标系
            // let transformationCoordinate = perState.matrix.map((item) => ({
            //     x: item.x - origin.x,
            //     y: item.y - origin.y,
            //     color: item.color
            // }));
            //第二步: 利用数学公式，点（x,y）以原点为旋转中心顺时针旋转90度后的坐标为（y, -x）,得出需旋转后的坐标
            // let afterRotate = transformationCoordinate.map((item) => ({
            //     x: (item.y),
            //     y: -(item.x),
            //     color: item.color
            // }));
            //第三步: 恢复成原来的坐标系
            // let recoveryCoordinate = afterRotate.map((item) => ({
            //     x: item.x + origin.x,
            //     y: item.y + origin.y,
            //     color: item.color
            // }));
            //第四部: 对新的数组进行排序
            // recoveryCoordinate.sort((a, b) => {
            //     return (a.y * 10 + a.x) - (b.y * 10 + b.x)
            // });
            // return {
            //     matrix: activeTetrisMatrix.map((item) => ({
            //         x: (item.y - origin.y) + origin.x,
            //         y: -(item.x - origin.x) + origin.y,
            //         color: item.color
            //     })).sort(sortRule)
            // };

            activeTetrisMatrix = activeTetrisMatrix.map((item) => ({
                x: (item.y - origin.y) + origin.x,
                y: -(item.x - origin.x) + origin.y,
                color: item.color
            })).sort(sortRule);
            return detectionOfActive(activeTetrisMatrix, residueBlocks) ? {
                matrix: activeTetrisMatrix
            } : perState.activeTetris;

        case TURN:
            //翻转算法
            //第一步:找出所有的当前活动块的所有横坐标
            let allX = [];
            for (let i = 0, length = activeTetrisMatrix.length; i < length; i++) {
                if (allX.indexOf(activeTetrisMatrix[i].x) === -1) {
                    allX.push(activeTetrisMatrix[i].x);
                }
            }
            allX.sort((a, b) => a - b);
            //第二步: 根据allX的长度，确认翻情况
            let newMatrix;
            switch (allX.length) {
                case 1:
                    newMatrix = activeTetrisMatrix;
                    break;
                case 2:
                    newMatrix = activeTetrisMatrix.map((item) => ({
                        x: item.x === allX[0] ? allX[1] : allX[0],
                        y: item.y,
                        color: item.color
                    }));
                    newMatrix = detectionOfActive(newMatrix, residueBlocks) ? newMatrix : activeTetrisMatrix;
                    break;
                case 3:
                    newMatrix = activeTetrisMatrix.map((item) => ({
                        x: item.x === allX[0] ? allX[2] : item.x === allX[1] ? allX[1] : allX[0],
                        y: item.y,
                        color: item.color
                    }));
                    newMatrix = detectionOfActive(newMatrix, residueBlocks) ? newMatrix : activeTetrisMatrix;
                    break;
                default :
                    newMatrix = activeTetrisMatrix;
                    break;
            }
            return {
                matrix: newMatrix.sort(sortRule)
            };
        default:
            return perState.activeTetris;
    }
}

function modeReducers(perState, action) {
    switch (action.type) {
        case CHANGE_MODE:
            return !perState;
        default:
            return perState ? perState : 'human';
    }
}

function stateReducers(perState, action) {
    switch (action.type) {
        case CHANGE_STATE:
            return action.payload.state;
        default:
            return perState ? perState : READY;
    }
}

function sortRule(a, b) {
    return (a.y * 15 + a.x) - (b.y * 15 + b.x)
}

function getNextTetris() {
    let color;
    switch (Number.parseInt(Math.random() * 4)) {
        case 0:
            color = '#e28c00';
            break;
        case 1:
            color = '#7ec100';
            break;
        case 2:
            color = '#c30083';
            break;
        default :
            color = '#104ba9';
            break;
    }
    switch (Number.parseInt(Math.random() * 19)) {
        case 0:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color}
                ]
            };
        case 1:
            return {
                matrix: [
                    {x: 6, y: 0, color: color},
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 9, y: 0, color: color}
                ]
            };
        case 2:
            return {
                matrix: [
                    {x: 8, y: 0, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 8, y: 2, color: color},
                    {x: 8, y: 3, color: color}
                ]
            };
        case 3:
            return {
                matrix: [
                    {x: 8, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 9, y: 1, color: color}
                ]
            };
        case 4:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 7, y: 2, color: color}
                ]
            };
        case 5:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 9, y: 0, color: color},
                    {x: 8, y: 1, color: color}
                ]
            };
        case 6:
            return {
                matrix: [
                    {x: 8, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 8, y: 2, color: color}
                ]
            };
        case 7:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 8, y: 2, color: color}
                ]
            };
        case 8:
            return {
                matrix: [
                    {x: 8, y: 0, color: color},
                    {x: 9, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color}
                ]
            };
        case 9:
            return {
                matrix: [
                    {x: 8, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 7, y: 2, color: color}
                ]
            };
        case 10:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 9, y: 1, color: color}
                ]
            };
        case 11:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 7, y: 2, color: color},
                    {x: 8, y: 2, color: color}
                ]
            };
        case 12:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 9, y: 0, color: color},
                    {x: 7, y: 1, color: color}
                ]
            };
        case 13:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 8, y: 2, color: color}
                ]
            };
        case 14:
            return {
                matrix: [
                    {x: 9, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 9, y: 1, color: color}
                ]
            };
        case 15:
            return {
                matrix: [
                    {x: 8, y: 0, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 8, y: 2, color: color},
                    {x: 7, y: 2, color: color}
                ]
            };
        case 16:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 9, y: 0, color: color},
                    {x: 9, y: 1, color: color}
                ]
            };
        case 17:
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 8, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 7, y: 2, color: color}
                ]
            };
        default :
            return {
                matrix: [
                    {x: 7, y: 0, color: color},
                    {x: 7, y: 1, color: color},
                    {x: 8, y: 1, color: color},
                    {x: 9, y: 1, color: color}
                ]
            };
    }
}