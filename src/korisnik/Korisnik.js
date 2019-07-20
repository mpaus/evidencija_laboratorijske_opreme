import React  from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

class Korisnik extends React.Component {

    render(){
        return (
            <Card>
                <div>
                  <Grid container wrap="nowrap" spacing={3}>
                      <Grid item xs={5} style={{ display: 'flex' }}>
                          <img src={this.props.data.slikaUrl} style={{ width: '100%', height: '100%' }} width={250} height={250} alt={`${this.props.data.ime} ${this.props.data.prezime}`}/>
                      </Grid>
                    <Grid item xs={7} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', textAlign: 'left'}}>
                    <Typography>
                        Korisnik: {`${this.props.data.ime} ${this.props.data.prezime}`}
                    </Typography>
                    <Typography>
                        Matični broj: {this.props.data.maticniBroj}
                    </Typography>
                    <Typography>
                        Uloga: {this.props.data.uloga && this.props.data.uloga.nazivUloge}
                    </Typography>
                        <Typography>
                            Email: {this.props.data.email}
                        </Typography>
                        <Typography>
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