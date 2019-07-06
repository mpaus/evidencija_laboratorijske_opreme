import React  from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

class Korisnik extends React.Component {

    render(){
        return (
            <Card>
                <div>
                  <Grid container spacing={3}>
                      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'space-around'}}>
                          <img src={this.props.data.slikaUrl} width={250} height={250} style={{ padding: '10px' }} alt={`${this.props.data.ime} ${this.props.data.prezime}`}/>
                      </Grid>
                    <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', textAlign: 'left'}}>
                    <Typography color="textSecondary" >
                        Korisnik: {`${this.props.data.ime} ${this.props.data.prezime}`}
                    </Typography>
                    <Typography color="textSecondary">
                        Matični broj: {this.props.data.maticniBroj}
                    </Typography>
                    <Typography color="textSecondary">
                        Uloga: {this.props.data.uloga && this.props.data.uloga.nazivUloge}
                    </Typography>
                        <Typography color="textSecondary">
                            Email: {this.props.data.email}
                        </Typography>
                        <Typography color="textSecondary">
                            Broj mobitela: {this.props.data.brojTelefona}
                        </Typography>
                    </Grid>
                  </Grid>
                </div>
            </Card>
        )

}
}

export default Korisnik;