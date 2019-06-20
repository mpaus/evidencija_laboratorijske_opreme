import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import gql from 'graphql-tag';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import TableRow from "./Korisnici";
import {Query, Mutation} from "react-apollo";
import { withApollo } from 'react-apollo'
import AuthContext from './context/authContext';
import TableCell from "@material-ui/core/TableCell";
import { ULOGA_KORISNIKA } from './apollo/queries';
import { CREATE_USER } from './apollo/mutations';

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});

class CreateUser extends React.Component {

    static contextType = AuthContext;

    state = {
        vrstaKorisnika: 'student',
        email: '',
        lozinka: '',
        maticniBroj: '',
        ime: '',
        prezime: '',
        brojTelefona: '',
        ulogaId: null,
        slika: null
    };

    update = async (data1, data2, data3) => {
        console.log(data1, 'aaaaaa', data2, 'bbbbbb', data3, 'ccccc');

        const query = gql`
          query Login($email: String!, $lozinka: String!) {
            login(email: $email, lozinka: $lozinka){
              user{
                  id
                  email
                  lozinka
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
                login.user.id,
                login.tokenExpiration
            );
        }
    };

    handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        this.setState({ slika: file });
    };

    handleChange = name => ({ target: element }) => {
        console.log(element.value, '---VALUE', name, '---NAME');
        this.setState({
            [name] : element.value
        })
    };

    handleUlogaChange = (e, value) => this.setState({ ulogaId: value });

    render() {
    const { classes } = this.props;
    console.log(this);

return (
    <React.Fragment>
    <CssBaseline />
    <main className={classes.layout}>
        <Paper className={classes.paper}>
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Unesite podatke o novom korisninku
                </Typography>
                <Mutation mutation={CREATE_USER} update={this.update}>
                    {createUser => (
                        <React.Fragment>
                        <form
                            ref={ref => this.form = ref}
                        >
                            <FormGroup>
                                <FormControl>
                                    <FormLabel>Vrsta korisnika</FormLabel>
                                    <RadioGroup
                                        name="vrstaKorisnika"
                                        onChange={this.handleUlogaChange}
                                    >
                                        <Query query={ULOGA_KORISNIKA}>
                                            {
                                                ({loading, error, data}) => {
                                                    if(loading) return <h4>Loading</h4>;
                                                    if(error) console.log(error);
                                                    console.log(data);
                                                    const radioButtons = [];

                                                    data && data.uloga && data.uloga.forEach((uloga) => {
                                                        radioButtons.push(<FormControlLabel value={uloga.id} control={<Radio/>} label={uloga.nazivUloge}/>)
                                                    });

                                                    return radioButtons;
                                                }
                                            }
                                        </Query>
                                    </RadioGroup>
                                </FormControl>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="email"
                                            name="email"
                                            label="Email"
                                            fullWidth
                                            onChange={this.handleChange('email')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="lozinka"
                                            name="lozinka"
                                            label="Lozinka"
                                            fullWidth
                                            onChange={this.handleChange('lozinka')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="maticniBroj"
                                            name="maticniBroj"
                                            label="Matični broj"
                                            fullWidth
                                            onChange={this.handleChange('maticniBroj')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="ime"
                                            name="ime"
                                            label="Ime"
                                            fullWidth
                                            onChange={this.handleChange('ime')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="prezime"
                                            name="prezime"
                                            label="Prezime"
                                            fullWidth
                                            onChange={this.handleChange('prezime')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                    <Button
                                        color="primary"
                                        variant="raised"
                                        label="Choose a file to upload"
                                        onClick={() => this.imageUpload.click()}
                                    />
                                    <input
                                        ref={ref => (this.imageUpload = ref)}
                                        type="file"
                                        onChange={e => this.handleImageChange(e)}
                                    />
                                    </Grid>
                                    {/*<Grid item xs={12} sm={6}>*/}
                                        {/*<Query query={SMJER_QUERY}>*/}
                                            {/*{*/}
                                                {/*({loading, error, data}) => {*/}
                                                    {/*if (loading) return <h4>Loading</h4>;*/}
                                                    {/*if (error) console.log(error);*/}
                                                    {/*console.log(data);*/}
                                                    {/*const menuItems = [];*/}

                                                    {/*data.smjer.forEach((smjer) => {*/}
                                                        {/*menuItems.push(*/}
                                                            {/*<MenuItem*/}
                                                                {/*value={smjer.nazivSmjera}*/}
                                                            {/*>*/}
                                                                {/*{smjer.nazivSmjera}*/}
                                                            {/*</MenuItem>*/}
                                                        {/*)*/}
                                                    {/*});*/}

                                                    {/*return (*/}
                                                        {/*<Select value="Strucni studij Telematika">*/}
                                                            {/*{menuItems}*/}
                                                        {/*</Select>)*/}
                                                {/*}*/}
                                            {/*}*/}
                                        {/*</Query>*/}
                                    {/*</Grid>*/}
                                    {/*<Grid item xs={12} sm={6}>*/}
                                        {/*<TextField*/}
                                            {/*required*/}
                                            {/*id="godina"*/}
                                            {/*name="godina"*/}
                                            {/*label="Godina"*/}
                                            {/*fullWidth*/}
                                        {/*/>*/}
                                    {/*</Grid>*/}
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="brojTelefona"
                                            name="brojTelefona"
                                            label="Broj Mobitela"
                                            fullWidth
                                            onChange={this.handleChange('brojTelefona')}
                                        />
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </form>
                        <Button
                        color="primary"
                        variant="raised"
                        onClick={() => createUser({ variables: {
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

export default withStyles(styles)(withApollo(CreateUser));