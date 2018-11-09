import React from 'react';
import {connect} from 'react-redux';
import {updateControl} from './Grid.js';
import {moveLeft, moveRight, rotate, turn} from "../action/action";

class ControlButtons extends React.PureComponent {
    render() {
        return (
            <div className='control'>
                <div className="button-group">
                    <div className="button-warp">
                        <button className="rotate" onClick={() => this.props.dispatch(rotate())}>旋转</button>
                    </div>
                    <div className="button-warp">
                        <button className="turn" onClick={() => this.props.dispatch(turn())}>翻转</button>
                    </div>
                    <div className="button-warp">
                        <button className="left-move" onClick={() => this.props.dispatch(moveLeft())}>左移</button>
                    </div>
                    <div className="button-warp">
                        <button className="right-move" onClick={() => this.props.dispatch(moveRight())}>左移</button>
                    </div>
                </div>
                <button className="accelerate" onClick={
                    () => {
                        updateControl.clear();
                        updateControl.updateTime = 16;
                        updateControl.play();
                    }
                }>加速
                </button>
            </div>
        )
    }
}

export default connect()(ControlButtons);