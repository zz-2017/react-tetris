import React from 'react';
import { connect } from 'react-redux';

class Account extends React.Component{
    render () {
        return (
            <div className="account-warp">
                <div className="account">
                    <p>得分:</p>
                    <svg width="75" height="75" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="15"/>
                        <circle cx="50" cy="50" r="35"  stroke="#689ad3" strokeWidth="15"
                                fill="none" strokeDasharray={ (this.props.account / 100 * 283) + ' 283' } transform="rotate(-90, 50, 50)" />
                    </svg>
                    <p className="number">{ this.props.account }</p>
                </div>
            </div>
        );
    }
}

let getState = (state) => ({
    account: state.account
});
export default connect(getState)(Account);