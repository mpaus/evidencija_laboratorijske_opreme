import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import FormHelperText from '@material-ui/core/FormHelperText';
import AuthContext from '../context/authContext';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

class Prijava extends React.Component {

    state = {
        email: '',
        lozinka: '',
        showPassword: false,
        isLogin: false,
        emailError: false,
        lozinkaError: false,
    };

    static contextType = AuthContext;

    handleChange = name => ({ target: element }) => {
        this.setState({
            [name] : element.value
        }, () => this.validateForm([name]));
    };

    validateForm = (formData) => {
        let error = false;

        formData.forEach(data => {
            this.setState({[`${data}Error`]: this.state[data] === '' });
            if(this.state[data] === ''){
                error = true;
            }
        });

        return !error;
    };

    login = async (client) => {

        if(this.validateForm(['email','lozinka'])) {

            const query = gql`
          query Login($email: String!, $lozinka: String!) {
            login(email: $email, lozinka: $lozinka){
              korisnik{
                  id
                  email
                  lozinka
                  ime
                  prezime
                  slikaUrl
                  uloga {
                    id
                    nazivUloge
                  }
                }
              token
              tokenExpiration
            }
          }
        `;

            const login = await client.query({
                query: query,
                variables: {
                    email: this.state.email,
                    lozinka: this.state.lozinka
                }
            }).then(res => res.data.login[0]);


            if (login.token) {
                this.context.login(
                    login.token,
                    login.korisnik.id,
                    login.korisnik.ime,
                    login.korisnik.prezime,
                    login.korisnik.uloga.id,
                    login.korisnik.slikaUrl,
                    login.tokenExpiration
                );
            }
        }
    };

    render() {
        const {classes} = this.props;
        const {history} = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Prijava
                    </Typography>
                    <ApolloConsumer>
                        { client => (
                            <form className={classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        error={this.state.emailError}
                                        autoComplete="email"
                                        onChange={this.handleChange('email')}
                                        autoFocus
                                    />
                                    {this.state.emailError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="lozinka">Lozinka</InputLabel>
                                    <Input
                                        name="lozinka"
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        id="lozinka"
                                        error={this.state.lozinkaError}
                                        onChange={this.handleChange('lozinka')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Uključi vidljivost lozinke"
                                                    onClick={() => this.setState((prevState) => ({
                                                        showPassword: !prevState.showPassword
                                                    }))}
                                                    >
                                                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {this.state.lozinkaError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                </FormControl>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => this.login(client)}
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Prijavi se
                                </Button>
                            </form>
                        )
                        }
                    </ApolloConsumer>
                    <Link
                        style={{ paddingTop: '15px', cursor: 'pointer'}}
                        className={classes.link}
                        onClick={() => {
                            history.push('/kreirajKorisnika')
                        }}
                    >
                        Nemate račun? Kreirajte ga.
                    </Link>
                </Paper>
            </main>
        );
    }
}

Prijava.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Prijava));