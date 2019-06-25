import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import {Mutation, Query} from 'react-apollo';
import { KATEGORIJA_QUERY, UREDAJ_QUERY } from './apollo/queries';
import {CREATE_UREDAJ, UPDATE_UREDAJ } from './apollo/mutations';
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddKategorijaDialog from './AddKategorijaDialog';
import Composer from "react-composer";

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
            kategorijaId: null
        };
    }

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
        const { uredaj } = cache.readQuery({ query: UREDAJ_QUERY });

        console.log(uredaj, CreateUredaj);

        cache.writeQuery({
            query: UREDAJ_QUERY,
            data: {
                uredaj: uredaj.concat(CreateUredaj)
            }
        });

        this.setState({ open: false });
    };

    updateCacheUpdate = (cache, { data: { UpdateUredaj }}) => {
        const { uredaj } = cache.readQuery({ query: UREDAJ_QUERY });

        cache.writeQuery({
            query: UREDAJ_QUERY,
            data: {
                uredaj: uredaj.map((uredajListItem, index) => uredajListItem.id === UpdateUredaj.id ? UpdateUredaj : uredajListItem)
            }
        });

        this.props.uredajInfoState(null);
        this.setState({ open: false });
    };

    render(){
        console.log(this.props, 'PROP');
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                    <DialogTitle id="responsive-dialog-title">{this.props.uredajInfo ? 'Unesite nove podatke o uređaju' : 'Unesite podatke o novom uređaju'}</DialogTitle>
                    <DialogContent>
                        <Composer
                            components={[
                                <Mutation mutation={CREATE_UREDAJ} update={this.updateCache}/>,
                                <Mutation mutation={UPDATE_UREDAJ} update={this.updateCacheUpdate}/>
                            ]}
                        >
                        {([createUredaj, updateUredaj]) => (
                            <React.Fragment>
                                <form
                                    ref={ref => this.form = ref}
                                >
                                    <FormGroup>
                                        <FormControl>
                                            <RadioGroup
                                                name="vrstaKorisnika"
                                                onChange={this.handleUlogaChange}
                                            >
                                                <Query query={KATEGORIJA_QUERY}>
                                                    {
                                                        ({loading, error, data}) => {
                                                            if(loading) return <h4>Loading</h4>;
                                                            if(error) console.log(error);
                                                            console.log(data);
                                                            const menuItems = [];

                                                            data && data.kategorija && data.kategorija.forEach((kategorija) => {
                                                                menuItems.push(<MenuItem value={kategorija.id}>{kategorija.nazivKategorije}</MenuItem>)
                                                            });

                                                            return (
                                                                <React.Fragment>
                                                                <InputLabel htmlFor="kategorija-uredaj">Kategorija</InputLabel>
                                                                <Select
                                                                    value={this.state.kategorijaId}
                                                                    inputProps={{
                                                                    name: 'kategorija',
                                                                    id: 'kateogrija-uredaj',
                                                                }}
                                                                onChange={this.handleChange('kategorijaId')}
                                                            >
                                                                {menuItems}
                                                            </Select>
                                                                    <IconButton
                                                                        aria-label="Dodaj kategoriju"
                                                                        size="small"
                                                                        onClick={() => this.setState({ dialogOpen: true })}
                                                                    >
                                                                        <AddIcon fontSize="inherit" />
                                                                    </IconButton>
                                                                </React.Fragment>);
                                                        }
                                                    }
                                                </Query>
                                            </RadioGroup>
                                        </FormControl>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="nazivUredaja"
                                                    name="nazivUredaja"
                                                    label="Naziv uređaja"
                                                    value={this.state.nazivUredaja}
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
                                                    value={this.state.serijskiBroj}
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
                                                    value={this.state.specifikacije}
                                                    fullWidth
                                                    onChange={this.handleChange('specifikacije')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    required
                                                    id="cijena"
                                                    name="cijena"
                                                    label="Cijena"
                                                    value={this.state.cijena}
                                                    fullWidth
                                                    onChange={this.handleChange('cijena')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    required
                                                    id="napomena"
                                                    name="napomena"
                                                    label="Napomena"
                                                    value={this.state.napomena}
                                                    fullWidth
                                                    onChange={this.handleChange('napomena')}
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
                                        </Grid>
                                    </FormGroup>
                                </form>
                                <Button
                                    color="primary"
                                    variant="raised"
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
                            </React.Fragment>
                        )}
                        </Composer>
                    </DialogContent>
                    <AddKategorijaDialog
                        open={this.state.dialogOpen}
                        />
            </Dialog>
        )

    }
}

export default UredajInfo;