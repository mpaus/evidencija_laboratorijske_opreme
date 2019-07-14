import React, {Component} from 'react';
import './App.css';
import { createUploadLink } from 'apollo-upload-client';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloProvider} from 'react-apollo';
import Dashboard from './dashboard/Dashboard';
import SignIn from './login/Prijava';
import CreateKorisnik from './login/CreateKorisnik';
import AuthContext from './context/authContext';
import moment from 'moment';


import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { SnackbarProvider } from 'notistack';

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

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: localStorage.getItem('token') || null,
            korisnikId: localStorage.getItem('korisnikId') || null,
            korisnikIme: localStorage.getItem('korisnikIme') || null,
            korisnikPrezime: localStorage.getItem('korisnikPrezime') || null,
            korisnikUlogaId: localStorage.getItem('korisnikUlogaId') || null,
            prijavaVrijeme: null,
            slikaUrl: localStorage.getItem('slikaUrl') || null
        };
    }

    login = (token, korisnikId, korisnikIme, korisnikPrezime, korisnikUlogaId, slikaUrl) => {
        localStorage.setItem('token', token);
        localStorage.setItem('korisnikId', korisnikId);
        localStorage.setItem('korisnikIme', korisnikIme);
        localStorage.setItem('korisnikPrezime', korisnikPrezime);
        localStorage.setItem('korisnikUlogaId', korisnikUlogaId);
        localStorage.setItem('slikaUrl', slikaUrl);
        this.setState({ token, korisnikId, korisnikIme, korisnikPrezime, korisnikUlogaId, slikaUrl, prijavaVrijeme: moment(new Date()) });
    };

    logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('korisnikId');
        localStorage.removeItem('token');
        localStorage.removeItem('korisnikId');
        localStorage.removeItem('korisnikIme');
        localStorage.removeItem('korisnikPrezime');
        localStorage.removeItem('korisnikUlogaId');
        localStorage.removeItem('slikaUrl');
      this.setState({ token: null, korisnikId: null });
    };

    render() {
        return (
            <ApolloProvider client={client}>
                <Router>
                <AuthContext.Provider value={{
                    token: this.state.token,
                    korisnikId: this.state.korisnikId,
                    korisnikIme: this.state.korisnikIme,
                    korisnikPrezime: this.state.korisnikPrezime,
                    korisnikUlogaId: this.state.korisnikUlogaId,
                    prijavaVrijeme: this.state.prijavaVrijeme,
                    slikaUrl: this.state.slikaUrl,
                    login: this.login,
                    logout: this.logout }}>
                <div className="container">
                    <SnackbarProvider maxSnack={5}>
                    <Switch>
                        {!this.state.token && <Redirect from="/" to="/auth" exact />}
                        {this.state.token && <Redirect from="/" to="/dashboard/oprema" exact />}
                        {this.state.token && <Redirect from="/auth" to="/dashboard/oprema" exact />}
                        {this.state.token && <Redirect from="/kreirajKorisnika" to="/dashboard/oprema" exact />}
                        {!this.state.token && <Redirect from="/dashboard" to="/auth" />}
                        {!this.state.token && <Route path="/auth" component={SignIn} />}
                        {this.state.token && <Route path="/dashboard" component={Dashboard} />}
                        {!this.state.token && <Route path="/kreirajKorisnika" component={CreateKorisnik} />}
                        {this.state.token && <Route path="/azurirajKorisnika" render={(props) => <CreateKorisnik korisnikId={this.state.korisnikId} {...props} />} />}
                    </Switch>
                    </SnackbarProvider>
                    </div>
                </AuthContext.Provider>
                </Router>
            </ApolloProvider>
        );
    }
}

export default App;
