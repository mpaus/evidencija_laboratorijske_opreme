import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import { Mutation } from 'react-apollo';
import {KORISNIK_QUERY} from './apollo/queries';
import {APROOVE_ZAHTJEV, DECLINE_ZAHTJEV, RETURN_UREDAJ_ZAHTJEV } from './apollo/mutations';
import Card from "@material-ui/core/Card";
import Composer from "react-composer";
import AuthContext from './context/authContext';

class ZahtjevInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            potvrdenZahtjev: false,
            napomenaProfesora: ''
        };
    }

    static contextType = AuthContext;

    updateCacheAproove = (cache, result) => {
        // const { uredaj } = cache.readQuery({ query: UREDAJ_QUERY });
        //
        // console.log(uredaj, CreateUredaj);
        //
        // cache.writeQuery({
        //     query: UREDAJ_QUERY,
        //     data: {
        //         uredaj: uredaj.concat(CreateUredaj)
        //     }
        // });
        //
        // this.setState({ open: false });
    };

    updateCacheDecline = (cache, result) => {
        // const { uredaj } = cache.readQuery({ query: UREDAJ_QUERY });
        //
        // console.log(uredaj, CreateUredaj);
        //
        // cache.writeQuery({
        //     query: UREDAJ_QUERY,
        //     data: {
        //         uredaj: uredaj.concat(CreateUredaj)
        //     }
        // });
        //
        // this.setState({ open: false });
    };

    updateCacheReturn = (cache, result) => {
        // const { uredaj } = cache.readQuery({ query: UREDAJ_QUERY });
        //
        // console.log(uredaj, CreateUredaj);
        //
        // cache.writeQuery({
        //     query: UREDAJ_QUERY,
        //     data: {
        //         uredaj: uredaj.concat(CreateUredaj)
        //     }
        // });
        //
        // this.setState({ open: false });
    };

    handleChange = name => ({ target: element }) => {
        console.log(element.value, '---VALUE', name, '---NAME');
        this.setState({
            [name] : element.value
        })
    };

    render(){
        console.log(this.state);
        return (
            <Card>
                <div>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <div>
                            <FormLabel>
                                Student: {this.props.data.korisnik.ime} {this.props.data.korisnik.prezime}
                            </FormLabel>
                            </div>
                            <div>
                                <FormLabel>
                                    Matični broj: {this.props.data.korisnik.maticniBroj}
                                </FormLabel>
                            </div>
                            <div>
                            <FormLabel>
                                Email: {this.props.data.korisnik.email}
                            </FormLabel>
                            </div>
                            <div>
                            <FormLabel>
                                Broj telefona: {this.props.data.korisnik.brojTelefona}
                            </FormLabel>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <FormLabel>
                                    Uredaj: {this.props.data.uredaj.nazivUredaja}
                                </FormLabel>
                            </div>
                            <div>
                                <FormLabel>
                                    Serijski broj: {this.props.data.uredaj.serijskiBroj}
                                </FormLabel>
                            </div>
                            <div>
                                <FormLabel>
                                    Specifikacije: {this.props.data.uredaj.specifikacije}
                                </FormLabel>
                            </div>
                            <div>
                                <FormLabel>
                                    Cijena: {this.props.data.uredaj.cijena}
                                </FormLabel>
                            </div>
                            <div>
                                <FormLabel>
                                    Napomena: {this.props.data.uredaj.napomena}
                                </FormLabel>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <FormLabel>
                                    Početak posudbe: {this.props.data.pocetakPosudbe}
                                </FormLabel>
                            </div>
                            <div>
                                <FormLabel>
                                    Kraj posudbe: {this.props.data.krajPosudbe}
                                </FormLabel>
                            </div>
                            <div>
                                <FormLabel>
                                    Razlog posudbe: {this.props.data.razlogPosudbe}
                                </FormLabel>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <Composer
                                components={[
                                    <Mutation mutation={APROOVE_ZAHTJEV} update={this.updateCacheAproove}/>,
                                    <Mutation mutation={DECLINE_ZAHTJEV} update={this.updateCacheDecline}/>,
                                    <Mutation mutation={RETURN_UREDAJ_ZAHTJEV} update={this.updateCacheReturn}/>
                                ]}
                            >
                                {([aprooveZahtjev, declineZahtjev, returnUredajZahtjev]) => (
                            <React.Fragment>
                            <TextField
                                required
                                id="napomenaProfesora"
                                name="napomenaProfesora"
                                label="Napomena profesora"
                                fullWidth
                                onChange={this.handleChange('napomenaProfesora')}
                            />
                            <Button
                                color="primary"
                                variant="raised"
                                onClick={() => {
                                    if(this.state.potvrdenZahtjev) {
                                        return returnUredajZahtjev({
                                            variables: {
                                                input: {
                                                    id: this.props.data.id
                                                }
                                            }
                                        })
                                    } else {
                                        this.setState({ prihvacenUredaj: true });
                                        return aprooveZahtjev({
                                            variables: {
                                                input: {
                                                    id: this.props.data.id,
                                                    odobritelj: this.context.userId,
                                                    napomenaProfesora: this.state.napomenaProfesora
                                                }
                                            }
                                        })
                                    }
                                }}
                            >
                                {this.state.potvrdenZahtjev ? 'Vrati uređaj' : 'Potvrdi zahtjev'}
                            </Button>
                                {!this.state.potvrdenZahtjev && (<Button
                                color="primary"
                                variant="raised"
                                onClick={() => declineZahtjev({
                                        variables: {
                                            input: {
                                                id: this.props.data.id,
                                                odobritelj: this.context.userId,
                                                napomenaProfesora: this.state.napomenaProfesora
                                            }
                                        }
                                    })}
                            >
                                Odbij zahtjev
                            </Button>)}
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

export default ZahtjevInfo;