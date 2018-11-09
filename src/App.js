import React, {Component} from 'react';
import { connect } from 'react-redux';
import Grid from './compoments/Grid.js';
import NextTetris from './compoments/NextTetris.js';
import Account from './compoments/Account.js';
import ControlButtons from './compoments/ControlButtons.js';
import Seting from './compoments/seting.js';
import Panel from './compoments/Panel.js';
import { RUNNING } from './action/constant.js';
import './App.css';

class App extends Component {
    render() {
        let AppState = this.props.state !== RUNNING ? (<Panel/>) : ' ';
        return (
            <div className="App">
                <header>俄罗斯方块</header>
                <Grid/>
                <NextTetris/>
                <Account/>
                <Seting/>
                <ControlButtons/>
                <div className="clear"/>
                { AppState }
            </div>
        );
    }
}

let getState = (state) => ({
    state: state.state
});
export default connect(getState)(App);
