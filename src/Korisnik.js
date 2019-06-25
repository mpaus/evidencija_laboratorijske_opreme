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
import Card from "@material-ui/core/Card";

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

    render(){
        return (
            <Card>
                <div>
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
                </div>
            </Card>
        )

}
}

export default Korisnik;