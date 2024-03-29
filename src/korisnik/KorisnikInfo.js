import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import {Query, Mutation} from "react-apollo";
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import AuthContext from '../context/authContext';
import {ULOGA_KORISNIKA} from '../apollo/queries';
import { UPDATE_KORISNIK} from '../apollo/mutations';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from "@material-ui/core/FormHelperText";
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';
import DeleteKorisnik from "./DeleteKorisnik";

class KorisnikInfo extends React.Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            maticniBroj: this.props.korisnik.maticniBroj,
            ime: this.props.korisnik.ime,
            prezime: this.props.korisnik.prezime,
            brojTelefona: this.props.korisnik.brojTelefona,
            maticniBrojError: false,
            imeError: false,
            prezimeError: false,
            brojTelefonaError: false,
            slika: null,
            dialogOpen: false
        };

        this.updateDialogOpenState = this.updateDialogOpenState.bind(this);
    }

    updateDialogOpenState = (state) => {
        this.setState({
            dialogOpen: state
        })
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
            this.setState({[`${data}Error`]: this.state[data] === '' || this.state[data] === null });
            if(this.state[data] === '' || this.state[data] === null){
                error = true;
            }
        });

        return !error;
    };

    handleError = (err) => {
        this.props.enqueueSnackbar(err.message.replace('GraphQL error:', '').trim(),{ variant: 'error'})
    };

    update = (cache, { data: { UpdateKorisnik }}) => {

        this.props.enqueueSnackbar('Korisnik je kreiran', { variant: 'success' });

        localStorage.setItem('korisnikIme', UpdateKorisnik.ime);
        localStorage.setItem('korisnikPrezime', UpdateKorisnik.prezime);
        localStorage.setItem('slikaUrl', UpdateKorisnik.slikaUrl);

        this.props.history.push('/dashboard/oprema');
    };

    render() {
        const { classes } = this.props;

        return (<Mutation mutation={UPDATE_KORISNIK} update={this.update} onError={this.handleError}>
            {updateKorisnik => (
                <React.Fragment>
                    <form>
                        <FormGroup>
                            <FormControl>
                                <FormLabel style={{ paddingBottom: '10px' }}>Vrsta korisnika</FormLabel>
                                <RadioGroup
                                    name="vrstaKorisnika"
                                    style={{ flexDirection: 'row' }}
                                    value={this.props.korisnik.ulogaId}
                                    onChange={this.handleUlogaChange}
                                >
                                    <Query query={ULOGA_KORISNIKA}>
                                        {
                                            ({loading, error, data}) => {
                                                if(loading) return <div>Loading</div>;
                                                if(error) return <div>{error}</div>;
                                                const radioButtons = [];

                                                data && data.uloga && data.uloga.forEach((uloga, index) => {
                                                    radioButtons.push(<FormControlLabel key={index} value={uloga.id} disabled={true} control={<Radio/>} label={uloga.nazivUloge}/>)
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
                                            value={this.props.korisnik.email}
                                            disabled={true}
                                            name="email"
                                            onChange={this.handleChange('email')}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl required fullWidth>
                                        <InputLabel htmlFor="maticniBroj">Matični broj</InputLabel>
                                        <Input
                                            required
                                            id="maticniBroj"
                                            error={this.state.maticniBrojError}
                                            value={this.state.maticniBroj}
                                            name="maticniBroj"
                                            label="Matični broj"
                                            onChange={this.handleChange('maticniBroj')}
                                        />
                                        {this.state.maticniBrojError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl required fullWidth>
                                        <InputLabel htmlFor="ime">Ime</InputLabel>
                                        <Input
                                            required
                                            id="ime"
                                            name="ime"
                                            value={this.state.ime}
                                            error={this.state.imeError}
                                            label="Ime"
                                            onChange={this.handleChange('ime')}
                                        />
                                        {this.state.imeError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl required fullWidth>
                                        <InputLabel htmlFor="prezime">Prezime</InputLabel>
                                        <Input
                                            required
                                            id="prezime"
                                            name="prezime"
                                            value={this.state.prezime}
                                            error={this.state.prezimeError}
                                            label="Prezime"
                                            onChange={this.handleChange('prezime')}
                                        />
                                        {this.state.prezimeError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
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
                                            value={this.state.brojTelefona}
                                            error={this.state.brojTelefonaError}
                                            name="brojTelefona"
                                            onChange={this.handleChange('brojTelefona')}
                                        />
                                        {this.state.brojTelefonaError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
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
                        <div>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginLeft: '0px' }}
                                className={classes.button}
                                onClick={() => this.setState({ deleteKorisnikDialogOpen: true })}
                            >
                                Izbriši račun
                            </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            style={{ marginLeft: '5px' }}
                            className={classes.button}
                            onClick={() => {
                                this.props.enqueueSnackbar('Ažuriranje korisnika je u tijeku', { variant: 'default' });
                                return this.validateForm(
                                    [
                                        'maticniBroj',
                                        'ime',
                                        'prezime',
                                        'brojTelefona'
                                    ])
                                && updateKorisnik({ variables: {
                                        input: {
                                            id: this.props.korisnik.id,
                                            maticniBroj: this.state.maticniBroj,
                                            ime: this.state.ime,
                                            prezime: this.state.prezime,
                                            brojTelefona: this.state.brojTelefona,
                                        },
                                        file: this.state.slika
                                    }})
                            }}
                        >
                            Ažuriraj račun
                        </Button>
                        </div>
                        <DeleteKorisnik
                            open={this.state.deleteKorisnikDialogOpen}
                            profesorDelete={false}
                            updateDialogOpenState={this.updateDialogOpenState}
                            deleteKorisnikId={this.context.korisnikId}
                            deleteKorisnikUlogaId={this.context.korisnikUlogaId}
                        />
                    </div>
                </React.Fragment>
            )}
        </Mutation>);
    }
}

KorisnikInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,

};

export default withApollo(withRouter(withSnackbar(KorisnikInfo)));