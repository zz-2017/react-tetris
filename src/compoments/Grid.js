import React from 'react';
import {connect} from 'react-redux';
import { detectionOfCollision } from '../detection/detection.js';
import {moveDown, merge, eliminate} from "../action/action";
import { RUNNING } from '../action/constant.js'

//更新控制对象
export let updateControl = {
    updateTime: 500,
    updateTake: null,
    int: null,
    clear: function () {
        clearTimeout(this.int);
    },
    play: function () {
        this.int = setTimeout(() => {
            this.updateTake();
        }, this.updateTime);
    },
};

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.gridCanvas = React.createRef();
        this.canvasContext = null;
        this.newActive = false;
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.state === RUNNING) {
            updateControl.clear();

            this.canvasContext.clearRect(0, 0, 600, 1200);
            this.drawing(nextProps.tetris.matrix);
            this.drawing(nextProps.residueBlocks);

            if (detectionOfCollision(nextProps.tetris.matrix, nextProps.residueBlocks)) {
                updateControl.updateTime = 300;
                updateControl.updateTake = () => {
                    this.newActive = true;
                    this.props.dispatch(merge());
                };
                updateControl.play();

                updateControl.updateTime = 500;
            } else {

                updateControl.updateTake = () => { this.props.dispatch(moveDown()); };
                if (this.newActive) {
                    this.newActive = false;
                    this.props.dispatch(eliminate());
                }
                updateControl.play();
            }
        } else {
            updateControl.clear();
        }
        return false;
    }

    render() {
        return (
            <div className="grid">
                <canvas className="main-screen" width='600' height='1200' ref={this.gridCanvas}/>
            </div>
        )
    }

    componentDidMount() {
        this.canvasContext = this.gridCanvas.current.getContext('2d');
        this.drawing(this.props.tetris.matrix);
        this.drawing(this.props.residueBlocks);
        updateControl.updateTime = 700;
        //注意这里必须使用箭头函数，确保this指向
        updateControl.updateTake = () => {
            this.props.dispatch(moveDown());
        };
        // updateControl.play();
    }

    drawing(matrix) {
        let canvasContext = this.canvasContext;
        canvasContext.strokeStyle = 'rgba(0,0,0,0)';
        canvasContext.lineWidth = 5;
        for (let i = 0, matrixLength = matrix.length; i < matrixLength; i++) {
            canvasContext.fillStyle = matrix[i].color;
            canvasContext.strokeRect(matrix[i].x * 40, matrix[i].y * 40, 40, 40);
            canvasContext.fillRect(matrix[i].x * 40 + 5, matrix[i].y * 40 + 5, 30, 30);
        }
        canvasContext.fill();
    }
}

let getState = (state) => {
    return {
        tetris: state.activeTetris,
        residueBlocks: state.residueBlocks,
        state: state.state
    }
};

export default connect(getState)(Grid);