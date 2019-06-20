import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Mutation } from 'react-apollo';
import {KORISNIK_QUERY} from './apollo/queries';
import {DELETE_USER} from './apollo/mutations';

class Korisnik extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ open: nextProps.open });
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            update: false
        };
    }

    updateCacheDelete = (cache, { data : { DeleteUser: { id }}}) => {
        const { korisnik} = cache.readQuery({ query: KORISNIK_QUERY });

        console.log(id);

        cache.writeQuery({
            query: KORISNIK_QUERY,
            data: {
                korisnik: korisnik.filter(korisnik => korisnik.id !== id)
            }
        });

        this.setState({ open: false });
    };

    render(){
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Informacije o korisniku"}</DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                      <Grid item xs={6}>
                          <img src={this.props.data.slikaUrl} width={300} height={350} alt={`${this.props.data.ime} ${this.props.data.prezime}`}/>
                      </Grid>
                    <Grid item xs={6}>
                    <DialogContentText>
                        Korisnik: {`${this.props.data.ime} ${this.props.data.prezime}`}
                    </DialogContentText>
                    <DialogContentText>
                        Matični broj: {this.props.data.maticniBroj}
                    </DialogContentText>
                    <DialogContentText>
                        Uloga: {this.props.data.uloga && this.props.data.uloga.nazivUloge}
                    </DialogContentText>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                   <Mutation mutation={DELETE_USER} update={this.updateCacheDelete}>
                       {deleteUser => (
                    <Button onClick={() => deleteUser({ variables: { input: this.props.data.id }})} color="primary">
                        Izbriši korisnika
                    </Button>
                       )}
                   </Mutation>
                    <Button onClick={this.handleAzuriranje} color="primary" autoFocus>
                        Ažuriraj korisnika
                    </Button>
                </DialogActions>
            </Dialog>
        )

}
}

export default Korisnik;