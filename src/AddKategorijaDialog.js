import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Mutation } from 'react-apollo';
import {KATEGORIJA_QUERY} from './apollo/queries';
import {CREATE_KATEGORIJA} from './apollo/mutations';

class AddKategorijaDialog extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ open: nextProps.open });
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            update: false,
            nazivKategorije: ''
        };
    }

    updateCache = (cache, { data: { CreateKategorija }}) => {
        const { kategorija} = cache.readQuery({ query: KATEGORIJA_QUERY });

        console.log(kategorija, CreateKategorija);

        cache.writeQuery({
            query: KATEGORIJA_QUERY,
            data: {
                kategorija: kategorija.concat(CreateKategorija)
            }
        });

        this.setState({ open: false });
    };

    handleChange = name => ({ target: element }) => {
        console.log(element.value, '---VALUE', name, '---NAME');
        this.setState({
            [name] : element.value
        })
    };

    render(){
        console.log(this.state.nazivKategorije)
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Unesite kategoriju</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nazivKategorije"
                        label="Naziv kategorije"
                        type="nazivKategorije"
                        onChange={this.handleChange('nazivKategorije')}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Mutation mutation={CREATE_KATEGORIJA} update={this.updateCache}>
                        {createKategorija => (
                            <Button onClick={() => createKategorija({ variables: { input: this.state.nazivKategorije }})} color="primary">
                                Spremi kategoriju
                            </Button>
                        )}
                    </Mutation>
                </DialogActions>
            </Dialog>
        )

    }
}

export default AddKategorijaDialog;