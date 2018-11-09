import React from 'react';
import {changeState} from '../action/action.js';
import {connect} from 'react-redux';
import {READY, SUSPEND, RUNNING, END} from "../action/constant";

class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: '-60%',
            container : null,
        };
    }

    render() {
        return (
            <div className='panel-warp' style={{top: this.state.top}}>
                <div className="panel">
                    <p className='introduction'>
                        <span className='title'>游戏简介:</span>
                        当游戏得分值达到100时，即为游戏通关。
                        当残留块高度接触到顶部即为游戏失败。
                    </p>
                    <button className="play-button" onClick={() => {
                        this.animation('cut', () => {
                            this.props.dispatch(changeState({
                                state: RUNNING
                            }));
                        });
                    }}>{this.state.container}
                    </button>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.initState();
        this.animation('add');
    }

    initState() {
        switch (this.props.state) {
            case READY:
                this.setState({
                    top: '-60%',
                    container: '开始游戏'
                });
                return ;
            case SUSPEND:
                this.setState({
                    top: '-60%',
                    container: '继续游戏'
                });
                return ;
            case END:
                this.setState({
                    top: '-60%',
                    container: '再来一次'
                });
                return ;
            default :
                this.setState({
                    top: '-60%',
                    container: '开始游戏'
                });
                return ;
        }
    }
    animation(type, callback) {
        let int = setInterval(() => {
            let top = Number.parseInt(this.state.top.match(/^(-?\d*)%$/)[1]);
            let nextTop = type === 'add' ? top + 3 : top - 3;
            this.setState({
                top: nextTop + '%',
                container: this.state.container
            });
            if (nextTop >= 0 || nextTop <= -60) {
                clearTimeout(int);
                if (!!callback) {
                    callback();
                }
            }
        }, 16);
    }
}

let getState = (state) => ({
    state: state.state
});

export default connect(getState)(Panel);