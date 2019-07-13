import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import {Mutation, Query} from 'react-apollo';
import {AVAILABLE_UREDAJ_QUERY, KATEGORIJA_QUERY, UREDAJ_QUERY} from '../apollo/queries';
import {CREATE_UREDAJ, UPDATE_UREDAJ } from '../apollo/mutations';
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddKategorijaDialog from './AddKategorijaDialog';
import Composer from "react-composer";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";

class UredajInfo extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            open: nextProps.open,
            nazivUredaja: nextProps.uredajInfo && nextProps.uredajInfo.nazivUredaja,
            serijskiBroj: nextProps.uredajInfo && nextProps.uredajInfo.serijskiBroj,
            cijena: nextProps.uredajInfo && nextProps.uredajInfo.cijena.toString(),
            napomena: nextProps.uredajInfo && nextProps.uredajInfo.napomena,
            specifikacije: nextProps.uredajInfo && nextProps.uredajInfo.specifikacije,
            kategorijaId: nextProps.uredajInfo && nextProps.uredajInfo.kategorija.id
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            dialogOpen: false,
            nazivUredaja: '',
            serijskiBroj: '',
            cijena: null,
            napomena: '',
            specifikacije: '',
            slika: null,
            kategorijaId: null,
            addKategorijaDialogOpen: false
        };

        this.addKategorijaDialogOpen = this.addKategorijaDialogOpen.bind(this);
    }

    addKategorijaDialogOpen = (state) => {
        this.setState({
            addKategorijaDialogOpen: state
        });
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

    updateCache = (cache, { data: { CreateUredaj }}) => {
        if(this.props.prikaz !== 'dostupniUredaji') {
            const {uredaj} = cache.readQuery({query: UREDAJ_QUERY});

            console.log(uredaj, CreateUredaj);

            cache.writeQuery({
                query: UREDAJ_QUERY,
                data: {
                    uredaj: uredaj.concat(CreateUredaj)
                }
            });
        } else {
            const {uredaj} = cache.readQuery({query: AVAILABLE_UREDAJ_QUERY, variables: { stanjeId: 1 }});

            cache.writeQuery({
                query: AVAILABLE_UREDAJ_QUERY,
                variables: { stanjeId: 1 },
                data: {
                    uredaj: uredaj.concat(CreateUredaj)
                }
            });
        }

        this.props.uredajInfoState(false);
    };

    updateCacheUpdate = (cache, { data: { UpdateUredaj }}) => {
        if(this.props.prikaz !== 'dostupniUredaji') {
            const {uredaj} = cache.readQuery({query: UREDAJ_QUERY});

            cache.writeQuery({
                query: UREDAJ_QUERY,
                data: {
                    uredaj: uredaj.map((uredajListItem) => uredajListItem.id === UpdateUredaj.id ? UpdateUredaj : uredajListItem)
                }
            });
        } else {
            const {uredaj} = cache.readQuery({query: AVAILABLE_UREDAJ_QUERY, variables: { stanjeId: 1 }});

            cache.writeQuery({
                query: AVAILABLE_UREDAJ_QUERY,
                variables: { stanjeId: 1 },
                data: {
                    uredaj: uredaj.map((uredajListItem) => uredajListItem.id === UpdateUredaj.id ? UpdateUredaj : uredajListItem)
                }
            });
        }

        this.props.uredajInfoState(false);
    };

    render(){
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                    <DialogTitle id="responsive-dialog-title">{this.props.uredajInfo ? 'Unesite nove podatke o uređaju' : 'Unesite podatke o novom uređaju'}</DialogTitle>
                    <DialogContent>
                        <Composer
                            components={[
                                <Mutation mutation={CREATE_UREDAJ} update={this.updateCache}>{() => {}}</Mutation>,
                                <Mutation mutation={UPDATE_UREDAJ} update={this.updateCacheUpdate}>{() => {}}</Mutation>
                            ]}
                        >
                        {([createUredaj, updateUredaj]) => (
                            <React.Fragment>
                                <form
                                    ref={ref => this.form = ref}
                                >
                                    <FormGroup>
                                        <Grid container spacing={2}>
                                            <Grid item xs={11}>
                                        <FormControl
                                            fullWidth
                                        >
                                            <RadioGroup
                                                name="vrstaKorisnika"
                                                onChange={this.handleUlogaChange}
                                            >
                                                <InputLabel htmlFor="kategorija-uredaj">Kategorija</InputLabel>
                                                <Query query={KATEGORIJA_QUERY}>
                                                    {
                                                        ({loading, error, data}) => {
                                                            if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                                            if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                                            const menuItems = [];

                                                            data && data.kategorija && data.kategorija.forEach((kategorija, index) => {
                                                                menuItems.push(<MenuItem key={index} value={kategorija.id}>{kategorija.nazivKategorije}</MenuItem>)
                                                            });

                                                            return (
                                                                <Select
                                                                    value={this.state.kategorijaId || ''}
                                                                    autoWidth={true}
                                                                    inputProps={{
                                                                    name: 'kategorija',
                                                                    id: 'kateogrija-uredaj',
                                                                }}
                                                                onChange={this.handleChange('kategorijaId')}
                                                            >
                                                                {menuItems}
                                                            </Select>);
                                                        }
                                                    }
                                                </Query>
                                            </RadioGroup>
                                        </FormControl>
                                            </Grid>
                                            <Grid item xs={1}>
                                            <IconButton
                                                aria-label="Dodaj kategoriju"
                                                style={{ marginTop: '20px', marginLeft: '2.5%' }}
                                                size="small"
                                                onClick={() => this.setState({ addKategorijaDialogOpen: true })}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="nazivUredaja"
                                                    name="nazivUredaja"
                                                    label="Naziv uređaja"
                                                    value={this.state.nazivUredaja || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('nazivUredaja')}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="serijskiBroj"
                                                    name="serijskiBroj"
                                                    label="Serijski broj"
                                                    value={this.state.serijskiBroj || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('serijskiBroj')}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="specifikacije"
                                                    name="specifikacije"
                                                    label="Specifikacije"
                                                    value={this.state.specifikacije || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('specifikacije')}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="cijena"
                                                    name="cijena"
                                                    label="Cijena"
                                                    value={this.state.cijena || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('cijena')}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="napomena"
                                                    name="napomena"
                                                    label="Napomena"
                                                    value={this.state.napomena || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('napomena')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} style={{ marginBottom: '20px' }}>
                                                <div style={{ padding: '10px 0px' }}>
                                                    <FormLabel>
                                                        Odaberite sliku
                                                    </FormLabel>
                                                </div>
                                                <input
                                                    type="file"
                                                    onChange={e => this.handleImageChange(e)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </form>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="contained"
                                        style={{ marginLeft: '0px' }}
                                        onClick={() => this.props.uredajInfoState(false)}
                                    >
                                        Povratak
                                    </Button>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => this.props.uredajInfo ?
                                        updateUredaj({ variables: {
                                                input: {
                                                    id: this.props.uredajInfo && this.props.uredajInfo.id,
                                                    nazivUredaja: this.state.nazivUredaja,
                                                    serijskiBroj: this.state.serijskiBroj,
                                                    cijena: this.state.cijena,
                                                    napomena: this.state.napomena,
                                                    specifikacije: this.state.specifikacije,
                                                    kategorijaId: this.state.kategorijaId,
                                                },
                                                file: this.state.slika
                                            }})
                                        :
                                        createUredaj({ variables: {
                                            input: {
                                                nazivUredaja: this.state.nazivUredaja,
                                                serijskiBroj: this.state.serijskiBroj,
                                                cijena: this.state.cijena,
                                                napomena: this.state.napomena,
                                                specifikacije: this.state.specifikacije,
                                                kategorijaId: this.state.kategorijaId,
                                            },
                                            file: this.state.slika
                                        }})}
                                >
                                    {this.props.uredajInfo ? 'Ažuriraj uređaj' : 'Spremi uređaj'}
                                </Button>
                                </div>
                            </React.Fragment>
                        )}
                        </Composer>
                    </DialogContent>
                    <AddKategorijaDialog
                        open={this.state.addKategorijaDialogOpen}
                        addKategorijaDialogOpen={this.addKategorijaDialogOpen}
                        />
            </Dialog>
        )

    }
}

export default UredajInfo;