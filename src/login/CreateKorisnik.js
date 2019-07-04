import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import gql from 'graphql-tag';
import Radio from '@material-ui/core/Radio';
import withStyles from '@material-ui/core/styles/withStyles';
import {Query, Mutation} from "react-apollo";
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import AuthContext from '../context/authContext';
import { ULOGA_KORISNIKA } from '../apollo/queries';
import { CREATE_KORISNIK } from '../apollo/mutations';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from "@material-ui/core/FormHelperText";
import PropTypes from "prop-types";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3 * 2))]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: `${theme.spacing(3)}px 0 ${theme.spacing(5)}px`,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
});

class CreateKorisnik extends React.Component {

    static contextType = AuthContext;

    state = {
        vrstaKorisnika: 'student',
        email: '',
        lozinka: '',
        maticniBroj: '',
        ime: '',
        prezime: '',
        brojTelefona: '',
        emailError: false,
        lozinkaError: false,
        maticniBrojError: false,
        imeError: false,
        prezimeError: false,
        brojTelefonaError: false,
        ulogaId: 1,
        slika: null,
        showPassword: false
    };

    update = async () => {

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

        const login = await this.props.client.query({
            query: query,
            variables: {
                email: this.state.email,
                lozinka: this.state.lozinka
            }
        }).then(res => res.data.login[0]);

        if(login.token){
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
    };

    handleImageChange = (e) => {
        const file = e.target.files[0];
        this.setState({ slika: file });
    };

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

    handleUlogaChange = (e, value) => this.setState({ ulogaId: value });

    render() {
    const { classes } = this.props;

return (
    <React.Fragment>
    <CssBaseline />
    <main className={classes.layout}>
        <Paper className={classes.paper}>
            <React.Fragment>
                <Typography
                    variant="h6"
                    gutterBottom
                    style={{ marginBottom: '0.65em' }}
                >
                    Unesite podatke o novom korisninku
                </Typography>
                <Mutation mutation={CREATE_KORISNIK} update={this.update}>
                    {createKorisnik => (
                        <React.Fragment>
                        <form>
                            <FormGroup>
                                <FormControl>
                                    <FormLabel style={{ paddingBottom: '10px' }}>Vrsta korisnika</FormLabel>
                                    <RadioGroup
                                        name="vrstaKorisnika"
                                        style={{ flexDirection: 'row' }}
                                        value="1"
                                        onChange={this.handleUlogaChange}
                                    >
                                        <Query query={ULOGA_KORISNIKA}>
                                            {
                                                ({loading, error, data}) => {
                                                    if(loading) return <div>Loading</div>;
                                                    if(error) return <div>{error}</div>;
                                                    const radioButtons = [];

                                                    data && data.uloga && data.uloga.forEach((uloga, index) => {
                                                        radioButtons.push(<FormControlLabel key={index} value={uloga.id} control={<Radio/>} label={uloga.nazivUloge}/>)
                                                    });

                                                    return radioButtons;
                                                }
                                            }
                                        </Query>
                                    </RadioGroup>
                                </FormControl>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <FormControl required fullWidth>
                                            <InputLabel htmlFor="email">Email</InputLabel>
                                        <Input
                                            required
                                            id="email"
                                            error={this.state.lozinkaError}
                                            name="email"
                                            onChange={this.handleChange('email')}
                                        />
                                        {this.state.emailError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                        </FormControl>
                                        </Grid>
                                    <Grid item xs={12}>
                                        <FormControl required fullWidth>
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
                                            {this.state.emailError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl required fullWidth>
                                            <InputLabel htmlFor="maticniBroj">Matični broj</InputLabel>
                                        <Input
                                            required
                                            id="maticniBroj"
                                            error={this.state.lozinkaError}
                                            name="maticniBroj"
                                            label="Matični broj"
                                            onChange={this.handleChange('maticniBroj')}
                                        />
                                        {this.state.emailError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                        </FormControl>
                                        </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl required fullWidth>
                                            <InputLabel htmlFor="ime">Ime</InputLabel>
                                        <Input
                                            required
                                            id="ime"
                                            name="ime"
                                            error={this.state.lozinkaError}
                                            label="Ime"
                                            onChange={this.handleChange('ime')}
                                        />
                                        {this.state.emailError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                        </FormControl>
                                        </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl required fullWidth>
                                            <InputLabel htmlFor="prezime">Prezime</InputLabel>
                                        <Input
                                            required
                                            id="prezime"
                                            name="prezime"
                                            error={this.state.lozinkaError}
                                            label="Prezime"
                                            onChange={this.handleChange('prezime')}
                                        />
                                        {this.state.emailError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                        </FormControl>
                                        </Grid>
                                    <Grid item xs={12}>
                                    <div style={{ padding: '10px 0px' }}>
                                    <FormLabel>
                                    Odaberite sliku
                                    </FormLabel>
                                    </div>
                                    <div>
                                    <input
                                        type="file"
                                        onChange={e => this.handleImageChange(e)}
                                    />
                                    </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl required fullWidth>
                                            <InputLabel htmlFor="brojTelefona">Broj mobitela</InputLabel>
                                        <Input
                                            required
                                            id="brojTelefona"
                                            error={this.state.lozinkaError}
                                            name="brojTelefona"
                                            onChange={this.handleChange('brojTelefona')}
                                        />
                                        {this.state.emailError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                        </FormControl>
                                        </Grid>
                                </Grid>
                            </FormGroup>
                        </form>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                style={{ marginLeft: '0px' }}
                                className={classes.button}
                                onClick={() => this.props.history.push(`/auth`)}
                            >
                                Povratak
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginLeft: '0px' }}
                                className={classes.button}
                                onClick={() => this.validateForm(
                                    [
                                        'email',
                                        'lozinka',
                                        'maticniBroj',
                                        'ime',
                                        'prezime',
                                        'brojTelefona'
                                    ])
                                    && createKorisnik({ variables: {
                                            input: {
                                                email: this.state.email,
                                                lozinka: this.state.lozinka,
                                                maticniBroj: this.state.maticniBroj,
                                                ime: this.state.ime,
                                                prezime: this.state.prezime,
                                                brojTelefona: this.state.brojTelefona,
                                                ulogaId: this.state.ulogaId,
                                            },
                                            file: this.state.slika
                                        }})}
                            >
                                Spremi korisnika
                            </Button>
                        </div>
                        </React.Fragment>
                    )}
                </Mutation>
            </React.Fragment>
        </Paper>
    </main>
    </React.Fragment>
);
}
}

CreateKorisnik.propTypes = {
    classes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,

};

export default withStyles(styles)(withApollo(withRouter(CreateKorisnik)));