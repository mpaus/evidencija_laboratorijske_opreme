import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Mutation } from 'react-apollo';
import {KATEGORIJA_QUERY} from '../apollo/queries';
import {CREATE_KATEGORIJA} from '../apollo/mutations';
import { withSnackbar } from 'notistack';
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

class AddKategorijaDialog extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ open: nextProps.open });
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            update: false,
            nazivKategorije: '',
            nazivKategorijeError: false
        };
    }

    updateCache = (cache, { data: { CreateKategorija }}) => {
        this.props.enqueueSnackbar('Kategorija je kreirana', { variant: 'success' });

        const { kategorija} = cache.readQuery({ query: KATEGORIJA_QUERY });

        cache.writeQuery({
            query: KATEGORIJA_QUERY,
            data: {
                kategorija: kategorija.concat(CreateKategorija)
            }
        });

        this.props.addKategorijaDialogOpen(false);
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

    render(){
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Unesite kategoriju</DialogTitle>
                <DialogContent>
                    <FormControl required fullWidth>
                        <InputLabel htmlFor="nazivKategorije">Naziv kategorije</InputLabel>
                        <Input
                        autoFocus
                        margin="dense"
                        error={this.state.nazivKategorijeError}
                        id="nazivKategorije"
                        type="nazivKategorije"
                        onChange={this.handleChange('nazivKategorije')}
                        fullWidth
                    />
                    {this.state.nazivKategorijeError && (<FormHelperText style={{ color: '#d8000c'}}>Ovo polje je obavezno</FormHelperText>)}
                    </FormControl>
                    </DialogContent>
                <DialogActions>
                    <Mutation mutation={CREATE_KATEGORIJA} update={this.updateCache}>
                        {createKategorija => (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    style={{ marginRight: '20px' }}
                                    onClick={() => this.props.addKategorijaDialogOpen(false)}
                                >
                                    Povratak
                                </Button>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    style={{ marginLeft: '0px' }}
                                    onClick={() => {
                                        if(this.validateForm(['nazivKategorije'])) {
                                            this.props.enqueueSnackbar('Kreiranje kategorije je u tijeku', {variant: 'default'});
                                            return createKategorija({variables: {input: this.state.nazivKategorije}})
                                        }
                                    }}
                                >
                                    Spremi kategoriju
                                </Button>
                            </div>
                        )}
                    </Mutation>
                </DialogActions>
            </Dialog>
        )

    }
}

export default withSnackbar(AddKategorijaDialog);