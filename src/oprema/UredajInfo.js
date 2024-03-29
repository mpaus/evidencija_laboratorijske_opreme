import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import {Mutation, Query} from 'react-apollo';
import {AVAILABLE_UREDAJ_QUERY, KATEGORIJA_QUERY, UREDAJ_QUERY} from '../apollo/queries';
import {CREATE_UREDAJ, UPDATE_UREDAJ } from '../apollo/mutations';
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddKategorijaDialog from './AddKategorijaDialog';
import Composer from "react-composer";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import { withSnackbar } from 'notistack';
import FormHelperText from "@material-ui/core/FormHelperText";

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
            nazivUredajaError: false,
            serijskiBrojError: false,
            cijenaError: false,
            specifikacijeError: false,
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
        this.setState({ slika: file });
    };

    handleChange = name => ({ target: element }) => {
        this.setState({
            [name] : element.value
        }, () => this.validateForm([name]));
    };

    handleError = (err) => {
        this.props.enqueueSnackbar(err.message.replace('GraphQL error:', '').trim(),{ variant: 'error'})
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

    updateCache = (cache, { data: { CreateUredaj }}) => {
        this.props.enqueueSnackbar('Uređaj je kreiran', { variant: 'success' });

        if(this.props.prikaz !== 'dostupniUredaji') {
            const {uredaj} = cache.readQuery({query: UREDAJ_QUERY});

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
        this.props.enqueueSnackbar('Uređaj je ažuriran', { variant: 'success' });

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
                                <Mutation mutation={CREATE_UREDAJ} update={this.updateCache} onError={this.handleError}>{() => {}}</Mutation>,
                                <Mutation mutation={UPDATE_UREDAJ} update={this.updateCacheUpdate} onError={this.handleError}>{() => {}}</Mutation>
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
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="nazivUredaja">Naziv uređaja</InputLabel>
                                                <Input
                                                    required
                                                    id="nazivUredaja"
                                                    name="nazivUredaja"
                                                    error={this.state.nazivUredajaError}
                                                    value={this.state.nazivUredaja || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('nazivUredaja')}
                                                />
                                                    {this.state.nazivUredajaError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="serijskiBroj">Serijski broj</InputLabel>
                                                <Input
                                                    required
                                                    id="serijskiBroj"
                                                    name="serijskiBroj"
                                                    error={this.state.serijskiBrojError}
                                                    value={this.state.serijskiBroj || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('serijskiBroj')}
                                                />
                                                {this.state.serijskiBrojError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="specifikacije">Specifikacije</InputLabel>
                                                <Input
                                                    required
                                                    id="specifikacije"
                                                    name="specifikacije"
                                                    value={this.state.specifikacije || ''}
                                                    error={this.state.specifikacijeError}
                                                    fullWidth
                                                    onChange={this.handleChange('specifikacije')}
                                                />
                                                    {this.state.specifikacijeError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="cijena">Cijena</InputLabel>
                                                <Input
                                                    required
                                                    id="cijena"
                                                    name="cijena"
                                                    value={this.state.cijena || ''}
                                                    error={this.state.cijenaError}
                                                    fullWidth
                                                    onChange={this.handleChange('cijena')}
                                                />
                                                    {this.state.cijenaError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="napomena">Napomena</InputLabel>
                                                <Input
                                                    required
                                                    id="napomena"
                                                    name="napomena"
                                                    value={this.state.napomena || ''}
                                                    fullWidth
                                                    onChange={this.handleChange('napomena')}
                                                />
                                                </FormControl>
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
                                    onClick={() => {
                                        if(this.props.uredajInfo) {
                                            if(this.validateForm(
                                                [
                                                    'nazivUredaja',
                                                    'serijskiBroj',
                                                    'specifikacije',
                                                    'cijena'
                                                ])) {
                                                this.props.enqueueSnackbar('Ažuriranje uređaja je u tijeku', {variant: 'default'});
                                                return updateUredaj({
                                                    variables: {
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
                                                    }
                                                })
                                            }
                                        } else {
                                            if (this.validateForm(
                                                [
                                                    'nazivUredaja',
                                                    'serijskiBroj',
                                                    'specifikacije',
                                                    'cijena'
                                                ])) {
                                                this.props.enqueueSnackbar('Kreiranje uređaja je u tijeku', {variant: 'default'});
                                                return createUredaj({
                                                    variables: {
                                                        input: {
                                                            nazivUredaja: this.state.nazivUredaja,
                                                            serijskiBroj: this.state.serijskiBroj,
                                                            cijena: this.state.cijena,
                                                            napomena: this.state.napomena,
                                                            specifikacije: this.state.specifikacije,
                                                            kategorijaId: this.state.kategorijaId,
                                                        },
                                                        file: this.state.slika
                                                    }
                                                })
                                            }
                                        }
                                    }}
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

export default withSnackbar(UredajInfo);