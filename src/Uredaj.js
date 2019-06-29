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

class Uredaj extends React.Component {

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
        console.log(this.props.data);
        return (
            <Card>
                <div>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <img src={this.props.data.slikaUrl} width={300} height={350} alt={this.props.data.nazivUredaja}/>
                        </Grid>
                        <Grid item xs={6}>
                            <DialogContentText>
                                Serijski broj: {this.props.data.serijskiBroj}
                            </DialogContentText>
                            <DialogContentText>
                                Naziv uredaja: {this.props.data.nazivUredaja}
                            </DialogContentText>
                            <DialogContentText>
                                Kategorija: {this.props.data.kategorija && this.props.data.kategorija.nazivKategorije}
                            </DialogContentText>
                            <DialogContentText>
                                Stanje: {this.props.data.stanje && this.props.data.stanje.nazivStanja}
                            </DialogContentText>
                            <DialogContentText>
                                Specifikacije: {this.props.data.specifikacije}
                            </DialogContentText>
                            <DialogContentText>
                                Cijena: {this.props.data.cijena}
                            </DialogContentText>
                            <DialogContentText>
                                Napomena: {this.props.data.napomena}
                            </DialogContentText>
                            <Button
                                color="primary"
                                variant="raised"
                                onClick={() => this.props.zahtjevState(this.props.data, true)}
                            >
                                Zatraži uređaj
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Card>
        )

    }
}

export default Uredaj;