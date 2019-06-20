import React, {Component} from 'react';
import './App.css';
import { createUploadLink } from 'apollo-upload-client';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloProvider} from 'react-apollo';
import Dashboard from './dashboard/Dashboard';
import SignIn from './SignIn';
import CreateUser from './CreateUser';
import AuthContext from './context/authContext';


import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

const client = new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.map(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        createUploadLink({ uri: 'http://localhost:8000/graphql' })
        ]),
    cache: new InMemoryCache(),

});


// const client = new ApolloClient({
//     link : createUploadLink({ uri: 'http://localhost:8000/graphql' })
// });


class App extends Component {
    state = {
        token: localStorage.getItem('token') || null,
        userId: localStorage.getItem( 'userId') || null
    };

    login = (token, userId, korisnikIme, korisnikPrezime, korisnikUlogaId, tokenExpiration) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('korisnikIme', korisnikIme);
        localStorage.setItem('korisnikPrezime',  korisnikPrezime);
        localStorage.setItem('korisnikUlogaId', korisnikUlogaId);
        this.setState({ token, userId });
    };

    logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
        localStorage.removeItem('korisnikIme');
        localStorage.removeItem('korisnikPrezime');
        localStorage.removeItem('korisnikUlogaId');
      this.setState({ token: null, userId: null });
    };

    render() {
        return (
            <ApolloProvider client={client}>
                <Router>
                <AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
                <div className="container">
                    <Switch>
                        {!this.state.token && <Redirect from="/" to="/auth" exact />}
                        {this.state.token && <Redirect from="/" to="/dashboard" exact />}
                        {this.state.token && <Redirect from="/auth" to="/dashboard" exact />}
                        {!this.state.token && <Route path="/auth" component={SignIn} />}
                        {this.state.token && <Route path="/dashboard" component={Dashboard} />}
                        {!this.state.token && <Route path="/kreirajKorisnika" component={CreateUser} />}
                        {this.state.token && <Redirect from="/kreirajKorisnika" to="/dashboard" exact />}
                    </Switch>
                    </div>
                </AuthContext.Provider>
                </Router>
            </ApolloProvider>
        );
    }
}

export default App;
