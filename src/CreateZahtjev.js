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
import { CREATE_ZAHTJEV } from './apollo/mutations';
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
import AuthContext from './context/authContext';

class CreateZahtjev extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ open: nextProps.open });
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            pocetakPosudbe: '',
            krajPosudbe: '',
            razlogPosudbe: ''
        };
    }

    static contextType = AuthContext;

    handleChange = name => ({ target: element }) => {
        console.log(element.value, '---VALUE', name, '---NAME');
        this.setState({
            [name] : element.value
        })
    };

    updateCache = (cache, { data: { CreateZahtjev }}) => {
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

    render(){
        console.log(this.context, 'CONTEXT');
        console.log(this.props);
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Unesite podatke o zahtjevu</DialogTitle>
                <DialogContent>
                    <Mutation mutation={CREATE_ZAHTJEV} update={this.updateCache}>
                        {createZahtjev => (
                            <React.Fragment>
                                <form
                                    ref={ref => this.form = ref}
                                >
                                    <FormGroup>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="pocetakPosudbe"
                                                    label="Početak posudbe"
                                                    type="datetime-local"
                                                    name="pocetakPosudbe"
                                                    defaultValue={new Date()}
                                                    onChange={this.handleChange('pocetakPosudbe')}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="krajPosudbe"
                                                    label="Kraj posudbe"
                                                    type="datetime-local"
                                                    name="krajPosudbe"
                                                    onChange={this.handleChange('krajPosudbe')}
                                                    defaultValue={new Date()}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="razlogPosudbe"
                                                    name="razlogPosudbe"
                                                    label="Razlog posudbe"
                                                    fullWidth
                                                    onChange={this.handleChange('razlogPosudbe')}
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </form>
                                <Button
                                    color="primary"
                                    variant="raised"
                                    onClick={() => createZahtjev({ variables: {
                                                input: {
                                                    pocetakPosudbe: this.state.pocetakPosudbe,
                                                    krajPosudbe: this.state.krajPosudbe,
                                                    razlogPosudbe: this.state.razlogPosudbe,
                                                    korisnikId: this.context.userId,
                                                    uredajId: this.props.data.id
                                                }
                                            }})}
                                >
                                    Pošaljji zahtjev
                                </Button>
                            </React.Fragment>
                        )}
                    </Mutation>
                </DialogContent>
                <AddKategorijaDialog
                    open={this.state.dialogOpen}
                />
            </Dialog>
        )

    }
}

export default CreateZahtjev;