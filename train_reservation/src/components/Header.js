import React, { Component } from 'react';
import {Link} from "react-router-dom";
const logo = require('../img/metro.svg');

class Header extends Component {
    render(){
        return(
            <div className="">
                <nav className="navbar navbar-dark bg-dark">
                    <div className="navbar-header">
                        <Link to="/">
                            <p className="navbar-brand container">
                                <img src={logo} width="30" height="30"
                                     className="d-inline-block align-top mx-2" alt="" />
                                Train Reservation System
                            </p>
                        </Link>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Header;