import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Mutation} from 'react-apollo';
import { withApollo } from 'react-apollo';
import { CREATE_ZAHTJEV } from '../apollo/mutations';
import FormGroup from "@material-ui/core/FormGroup";
import Input from '@material-ui/core/Input';
import AuthContext from '../context/authContext';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import {AVAILABLE_UREDAJ_QUERY} from '../apollo/queries';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

class CreateZahtjev extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ open: nextProps.open });
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            pocetakPosudbe: moment(new Date()).format('YYYY-MM-DD HH:mm'),
            krajPosudbe: moment(new Date()).format('YYYY-MM-DD HH:mm'),
            razlogPosudbe: '',
            razlogPosudbeError: false
        };
    }

    static contextType = AuthContext;

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

    updateCache = (cache,  {data : { CreateZahtjev }}) => {

        console.log(CreateZahtjev);

        const {uredaj} = cache.readQuery({query: AVAILABLE_UREDAJ_QUERY, variables: { stanjeId: 1 }});

        cache.writeQuery({
            query: AVAILABLE_UREDAJ_QUERY,
            variables: { stanjeId: 1 },
            data: {
                uredaj: uredaj.filter(uredaj => uredaj.id !== CreateZahtjev.uredaj.id)
            }
        });

        this.props.enqueueSnackbar('Zahtjev je kreiran', { variant: 'success' });

        this.props.client.clearStore();
        this.props.setZahtjevDialogOpen(false);
    };

    render(){
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
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                                    <KeyboardDateTimePicker
                                                        ampm={false}
                                                        label="Početak posudbe"
                                                        value={this.state.pocetakPosudbe}
                                                        disablePast
                                                        format="YYYY-MM-DD HH:mm"
                                                        onChange={(event, value) => this.setState({ pocetakPosudbe: value })}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                                    <KeyboardDateTimePicker
                                                        ampm={false}
                                                        value={this.state.krajPosudbe}
                                                        label="Kraj posudbe"
                                                        disablePast
                                                        format="YYYY-MM-DD HH:mm"
                                                        onChange={(event, value) => this.setState({ krajPosudbe: value })}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="razlogPosudbe">Razlog posudbe</InputLabel>
                                                <Input
                                                    required
                                                    id="razlogPosudbe"
                                                    name="razlogPosudbe"
                                                    error={this.state.razlogPosudbeError}
                                                    fullWidth
                                                    onChange={this.handleChange('razlogPosudbe')}
                                                />
                                                    {this.state.razlogPosudbeError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </form>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <Button
                                        variant="contained"
                                        style={{ marginLeft: '0px' }}
                                        onClick={() => this.props.setZahtjevDialogOpen(false)}
                                    >
                                        Povratak
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        style={{ marginLeft: '0px' }}
                                        onClick={() => {
                                            if(this.validateForm(['razlogPosudbe'])) {
                                                this.props.enqueueSnackbar('Kreiranje zahtjeva je u tijeku', {variant: 'default'});
                                                return createZahtjev({
                                                    variables: {
                                                        input: {
                                                            pocetakPosudbe: this.state.pocetakPosudbe,
                                                            krajPosudbe: this.state.krajPosudbe,
                                                            razlogPosudbe: this.state.razlogPosudbe,
                                                            korisnikId: this.context.korisnikId,
                                                            uredajId: this.props.data.id
                                                        }
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        Pošalji zahtjev
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}
                    </Mutation>
                </DialogContent>
            </Dialog>
        )

    }
}

export default withApollo(withSnackbar(CreateZahtjev));