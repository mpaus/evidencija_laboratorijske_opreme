import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import AuthContext from './context/authContext';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class SignIn extends React.Component {

    state = {
        email: '',
        lozinka: '',
        isLogin: false
    };

    static contextType = AuthContext;

    handleChange = name => ({ target: element }) => {
        console.log(element.value, '---VALUE', name, '---NAME');
        this.setState({
            [name] : element.value
        })
    };

    login = async (client) => {

        const query = gql`
          query Login($email: String!, $lozinka: String!) {
            login(email: $email, lozinka: $lozinka){
              user{
                  id
                  email
                  lozinka
                  ime
                  prezime
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

        console.log(login);

        if(login.token){
            this.context.login(
                login.token,
                login.user.id,
                login.user.ime,
                login.user.prezime,
                login.user.uloga.id,
                login.tokenExpiration
            );
        }

        console.log(login);
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
                        Sign in
                    </Typography>
                    <ApolloConsumer>
                        { client => (
                            <form className={classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        onChange={this.handleChange('email')}
                                        autoFocus/>
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Lozinka</InputLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        onChange={this.handleChange('lozinka')}
                                    />
                                </FormControl>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary"/>}
                                    label="Remember me"
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => this.login(client)}
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign in
                                </Button>
                            </form>
                        )
                        }
                    </ApolloConsumer>
                    <Link
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

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(SignIn));