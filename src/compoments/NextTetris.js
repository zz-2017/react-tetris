import React from 'react';
import { connect } from 'react-redux';

class NextTetris extends React.Component{
    constructor (props) {
        super(props);
        this.nextTetrisCanvas = React.createRef();
        this.canvasContext = null;
    }
    shouldComponentUpdate(nextProps) {
        this.canvasContext.clearRect(0,0,200,200);
        this.drawing(nextProps.matrix);
        return false;
    }
    render () {
        return (
            <div className="next-tetris-warp">
                <p>下个方块:</p>
                <canvas className="next-tetris" width='200' height='200' ref={this.nextTetrisCanvas}/>
            </div>
        )
    }
    componentDidMount() {
        this.canvasContext = this.nextTetrisCanvas.current.getContext('2d');
        this.canvasContext.clearRect(0,0,200,200);
        this.drawing(this.props.matrix);
    }
    drawing(matrix) {
        let canvasContext = this.canvasContext;
        canvasContext.strokeStyle = 'rgba(0,0,0,0)';
        canvasContext.lineWidth = 5;
        for (let i = 0, matrixLength = matrix.length; i < matrixLength; i++) {
            canvasContext.fillStyle = matrix[i].color;
            canvasContext.strokeRect( (matrix[i].x - 6) * 50, (matrix[i].y  - matrix[0].y) * 50, 50, 50);
            canvasContext.fillRect((matrix[i].x - 6) * 50 + 5, (matrix[i].y  - matrix[0].y) * 50 + 5, 40, 40);
        }
        canvasContext.fill();
    }
}

let getState = (state) => state.nextTetris;
export default connect(getState)(NextTetris);