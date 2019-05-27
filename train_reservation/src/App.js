import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Header from './components/Header';
import ReservationSearchForm from './components/ReservationSearchForm'
import UserForm from "./components/UserForm";
import CardPayment from "./components/CardPayment";
import DialogPayment from "./components/dialogPayment";

class App extends React.Component{
    render() {
        return (
            <BrowserRouter>
                <Header />
                <Route>
                    <Switch>
                        <Route path="/" exact component={ReservationSearchForm}/>
                        <Route path="/reservation" exact component={UserForm}/>
                    </Switch>
                </Route>
                <Route path="/reservation/cardpayment" component={CardPayment}/>
                <Route path="/reservation/dialogpay" component={DialogPayment}/>
            </BrowserRouter>
        );
    }
}

export default App;
