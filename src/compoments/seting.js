import React from 'react';
import { connect } from 'react-redux'
import { changeState } from "../action/action.js";
import { SUSPEND } from '../action/constant.js';

class Seting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            modeAi: false
        };
        this.stop = this.stop.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    render() {
        let AI = this.state.modeAi ? 'mode-toggle active' : 'mode-toggle';
        return (
            <div className='seting'>
                <div className='button stop' onClick={this.stop}>暂停</div>
                <div className={AI}>
                    <button className="toggle" onClick={this.toggle}>AI</button>
                </div>
            </div>
        )
    }

    stop() {
        this.props.dispatch(changeState({
            state: SUSPEND
        }));
    }

    toggle() {
        this.setState(perState => ({
            showDialog: perState.showDialog,
            modeAi: !perState.modeAi
        }))
    }
}
let getState = (state) => ({
    state: state.state
});

export default connect(getState)(Seting);