import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Mutation } from 'react-apollo';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { DELETE_KORISNIK }from '../apollo/mutations';
import {KORISNIK_QUERY} from "../apollo/queries";
import { withSnackbar } from 'notistack';

class DeleteKorisnik extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            open: nextProps.open,
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    updateCache = (cache, { data : { DeleteKorisnik: { id }}}) => {

        this.props.enqueueSnackbar('Korisnik je izbrisan', { variant: 'success' });

        const {korisnik} = cache.readQuery({
            query: KORISNIK_QUERY,
            variables: { ulogaId: parseInt(this.props.deleteKorisnikUlogaId) }
        });

        cache.writeQuery({
            query: KORISNIK_QUERY,
            variables: { ulogaId: parseInt(this.props.deleteKorisnikUlogaId) },
            data: {
                korisnik: korisnik.filter(korisnik => korisnik.id !== id)
            }
        });

        this.props.updateDialogOpenState(false);
    };

    render(){
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                <Mutation mutation={DELETE_KORISNIK} update={this.updateCache}>
                    { deleteKorisnik => (
                        <React.Fragment>
                        <DialogContent>
                    <DialogContentText style={{ paddingTop: '15px' }}>
                        Jeste li sigurni da želite izbrisati korisnika?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => this.props.updateDialogOpenState(false)}
                    >
                        Povratak
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.enqueueSnackbar('Brisanje korisnika je u tijeku', { variant: 'default' });
                            return deleteKorisnik({ variables: { input: this.props.deleteKorisnikId }})
                        }}
                        color="primary"
                    >
                        Izbriši
                    </Button>
                </DialogActions>
                        </React.Fragment>)}
                </Mutation>
            </Dialog>
        )

    }
}

export default withSnackbar(DeleteKorisnik);