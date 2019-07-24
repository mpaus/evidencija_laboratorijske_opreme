import React  from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Mutation } from 'react-apollo';
import {SPECIFIC_ZAHTJEV_QUERY} from '../apollo/queries';
import {APROOVE_ZAHTJEV, DECLINE_ZAHTJEV, RETURN_UREDAJ_ZAHTJEV } from '../apollo/mutations';
import Card from "@material-ui/core/Card";
import Composer from "react-composer";
import AuthContext from '../context/authContext';
import {Typography} from "@material-ui/core";
import { withSnackbar } from 'notistack';
import { withApollo } from 'react-apollo';

class ZahtjevInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            napomenaProfesora: ''
        };
    }

    static contextType = AuthContext;

    updateCacheAproove = (cache, {data:{ AprooveZahtjev }}) => {

        this.props.enqueueSnackbar('Zahtjev je odobren', { variant: 'success' });

        const { zahtjevPosudbe } = cache.readQuery({ query: SPECIFIC_ZAHTJEV_QUERY, variables: { stanjeId: 11} });

        cache.writeQuery({
            query: SPECIFIC_ZAHTJEV_QUERY,
            variables: { stanjeId: 11},
            data: {
                zahtjevPosudbe: zahtjevPosudbe.filter(zahtjevPosudbe => zahtjevPosudbe.id !== AprooveZahtjev.id)
            }
        });

        this.props.client.clearStore();
    };

    updateCacheDecline = (cache, {data:{ DeclineZahtjev }}) => {

        this.props.enqueueSnackbar('Zahtjev je odbijen', { variant: 'success' });

        const { zahtjevPosudbe } = cache.readQuery({ query: SPECIFIC_ZAHTJEV_QUERY, variables: { stanjeId: 11} });

        cache.writeQuery({
            query: SPECIFIC_ZAHTJEV_QUERY,
            variables: { stanjeId: 11},
            data: {
                zahtjevPosudbe: zahtjevPosudbe.filter(zahtjevPosudbe => zahtjevPosudbe.id !== DeclineZahtjev.id)
            }
        });
    };

    updateCacheReturn = (cache, {data:{ ReturnUredajZahtjev }}) => {

        this.props.enqueueSnackbar('Uređaj je vraćen', { variant: 'success' });

        const { zahtjevPosudbe } = cache.readQuery({ query: SPECIFIC_ZAHTJEV_QUERY, variables: { stanjeId: 12} });

        cache.writeQuery({
            query: SPECIFIC_ZAHTJEV_QUERY,
            variables: { stanjeId: 12},
            data: {
                zahtjevPosudbe: zahtjevPosudbe.filter(zahtjevPosudbe => zahtjevPosudbe.id !== ReturnUredajZahtjev.id)
            }
        });
    };

    handleChange = name => ({ target: element }) => {
        this.setState({
            [name] : element.value
        })
    };

    render(){
        return (
            <Card>
                <div style={{ margin: '10px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <div>
                                <Typography>
                                    Uredaj: {this.props.data.uredaj.nazivUredaja}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Serijski broj: {this.props.data.uredaj.serijskiBroj}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Specifikacije: {this.props.data.uredaj.specifikacije}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Cijena: {this.props.data.uredaj.cijena}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Napomena: {this.props.data.uredaj.napomena}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <Typography>
                                    Student: {this.props.data.korisnik.ime} {this.props.data.korisnik.prezime}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Matični broj: {this.props.data.korisnik.maticniBroj}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Email: {this.props.data.korisnik.email}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Broj telefona: {this.props.data.korisnik.brojTelefona}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                <Typography>
                                    Početak posudbe: {this.props.data.pocetakPosudbe}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Kraj posudbe: {this.props.data.krajPosudbe}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    Razlog posudbe: {this.props.data.razlogPosudbe}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Composer
                                components={[
                                    <Mutation mutation={APROOVE_ZAHTJEV} update={this.updateCacheAproove}>{()=>{}}</Mutation>,
                                    <Mutation mutation={DECLINE_ZAHTJEV} update={this.updateCacheDecline}>{()=>{}}</Mutation>,
                                    <Mutation mutation={RETURN_UREDAJ_ZAHTJEV} update={this.updateCacheReturn}>{()=>{}}</Mutation>
                                ]}
                            >
                                {([aprooveZahtjev, declineZahtjev, returnUredajZahtjev]) => (
                            <React.Fragment>
                                {this.props.data.stanje.id === '12' || this.props.data.stanje.id === '13' || this.props.data.stanje.id === '14' ?
                                    (<div>
                                        <Typography>
                                            Napomena profesora: {this.props.data.napomenaProfesora || '/'}
                                        </Typography>
                                    </div>)
                                    :
                                    (<TextField
                                        required
                                        id="napomenaProfesora"
                                        name="napomenaProfesora"
                                        label="Napomena profesora"
                                        fullWidth
                                        onChange={this.handleChange('napomenaProfesora')}
                                    />)}
                                <Grid item xs={12}>
                                    <div style={{ display: 'flex', justifyContent: this.props.data.stanje.id === '12' ? 'flex-end' : 'space-between', marginTop: '20px' }}>
                                {this.props.data.stanje.id === '11' && this.context.korisnikUlogaId === '2' && (<Button
                                    color="primary"
                                    variant="contained"
                                onClick={() => {
                                    this.props.enqueueSnackbar('Odbijanje zahtjeva je u tijeku', { variant: 'default' });
                                    return declineZahtjev({
                                        variables: {
                                            input: {
                                                id: this.props.data.id,
                                                odobritelj: this.context.korisnikId,
                                                napomenaProfesora: this.state.napomenaProfesora,
                                                uredajId: this.props.data.uredaj.id
                                            }
                                        }
                                    })
                                }}
                            >
                                Odbij zahtjev
                            </Button>)}
                                        {this.props.data.stanje.id !== '13'
                                        && this.props.data.stanje.id !== '14' && this.context.korisnikUlogaId === '2' && (<Button
                                            color="primary"
                                            variant="contained"
                                            onClick={() => {
                                                if (this.props.data.stanje.id === '12') {
                                                    this.props.enqueueSnackbar('Vraćanje uređaja je u tijeku', { variant: 'default' });
                                                    return returnUredajZahtjev({
                                                        variables: {
                                                            input: {
                                                                id: this.props.data.id,
                                                                uredajId: this.props.data.uredaj.id
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    this.props.enqueueSnackbar('Potvrđivanje zahtjeva je u tijeku', { variant: 'default' });
                                                    return aprooveZahtjev({
                                                        variables: {
                                                            input: {
                                                                id: this.props.data.id,
                                                                odobritelj: this.context.korisnikId,
                                                                napomenaProfesora: this.state.napomenaProfesora,
                                                                uredajId: this.props.data.uredaj.id
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                            }
                                        >
                                            {this.props.data.stanje.id === '12' ? 'Vrati uređaj' : 'Potvrdi zahtjev'}
                                        </Button>)}
                                    </div>
                                </Grid>
                            </React.Fragment>
                                )}
                            </Composer>
                        </Grid>
                    </Grid>
                </div>
            </Card>
        )

    }
}

export default withApollo(withSnackbar(ZahtjevInfo));