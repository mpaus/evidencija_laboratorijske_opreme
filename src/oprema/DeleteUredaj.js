import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Mutation } from 'react-apollo';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { DELETE_UREDAJ }from '../apollo/mutations';
import { UREDAJ_QUERY, AVAILABLE_UREDAJ_QUERY} from "../apollo/queries";
import { withSnackbar } from 'notistack';

class DeleteUredaj extends React.Component {

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

    updateCacheDelete = (cache, { data : { DeleteUredaj: { id }}}) => {

        this.props.enqueueSnackbar('Uređaj je izbrisan', { variant: 'success' });

        if(this.props.prikaz !== 'dostupniUredaji') {
            const {uredaj} = cache.readQuery({query: UREDAJ_QUERY});

            cache.writeQuery({
                query: UREDAJ_QUERY,
                data: {
                    uredaj: uredaj.filter(uredaj => uredaj.id !== id)
                }
            });
        } else {
            const {uredaj} = cache.readQuery({query: AVAILABLE_UREDAJ_QUERY, variables: { stanjeId: 1 }});

            cache.writeQuery({
                query: AVAILABLE_UREDAJ_QUERY,
                variables: { stanjeId: 1 },
                data: {
                    uredaj: uredaj.filter(uredaj => uredaj.id !== id)
                }
            });
        }

        this.props.updateDeleteDialogOpenState(false);
    };

    render(){
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                <Mutation mutation={DELETE_UREDAJ} update={this.updateCacheDelete}>
                    { deleteUredaj => (
                        <React.Fragment>
                            <DialogContent>
                                <DialogContentText style={{ paddingTop: '15px' }}>
                                    Jeste li sigurni da želite izbrisati uređaj?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color="primary"
                                    onClick={() => this.props.updateDeleteDialogOpenState(false)}
                                >
                                    Povratak
                                </Button>
                                <Button
                                    onClick={() => {
                                        this.props.enqueueSnackbar('Brisanje uređaja je u tijeku', { variant: 'default' });
                                        return deleteUredaj({ variables: { input: this.props.deleteUredajId }});
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

export default withSnackbar(DeleteUredaj);