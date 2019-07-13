import React  from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import {Typography} from "@material-ui/core";

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
        return (
            <Card>
                <div>
                    <Grid container spacing={3}>
                        <Grid item xs={4} style={{ display: 'flex' }}>
                            <img src={this.props.data.slikaUrl} style={{ width: '100%', height: '100%' }} alt={this.props.data.nazivUredaja}/>
                        </Grid>
                        <Grid item xs={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', textAlign: 'left'}}>
                            <Typography>
                                Serijski broj: {this.props.data.serijskiBroj}
                            </Typography>
                            <Typography>
                                Naziv uredaja: {this.props.data.nazivUredaja}
                            </Typography>
                            <Typography>
                                Kategorija: {this.props.data.kategorija && this.props.data.kategorija.nazivKategorije}
                            </Typography>
                            <Typography>
                                Stanje: {this.props.data.stanje && this.props.data.stanje.nazivStanja}
                            </Typography>
                            <Typography>
                                Specifikacije: {this.props.data.specifikacije}
                            </Typography>
                            <Typography>
                                Cijena: {this.props.data.cijena}
                            </Typography>
                            <Typography>
                                Napomena: {this.props.data.napomena}
                            </Typography>
                        </Grid>
                            <Grid item xs={3}>
                            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%', height: '100%'}}>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{
                                    height: '30%',
                                    width: '50%',
                                    margin: 'auto'
                                }}
                                onClick={() => this.props.zahtjevState(this.props.data, true)}
                            >
                                Zatraži uređaj
                            </Button>
                            </div>
                            </Grid>
                    </Grid>
                </div>
            </Card>
        )

    }
}

export default Uredaj;