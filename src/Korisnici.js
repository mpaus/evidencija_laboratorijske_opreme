import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import {Query} from 'react-apollo';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Dialog from '@material-ui/core/Dialog';
import Korisnik from './Korisnik';
import { KORISNIK_QUERY } from './apollo/queries';

export class Korisnici extends Component {

    state = {
        korisnikDialogOpen: false,
        korisnikDialogData: {}
    };

    openKorisnikModal = (korisnik) => {
        this.setState({ korisnikDialogOpen: true, korisnikDialogData: korisnik})
    };

    render() {
        return (
            <Card>
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Matični broj</TableCell>
                        <TableCell align="right">Ime i Prezime</TableCell>
                        <TableCell align="right">Uloga</TableCell>
                    </TableRow>
                </TableHead>
                    <TableBody>
                        <Query query={KORISNIK_QUERY}>
                            {
                                ({loading, error, data}) => {
                                    if(loading) return <h4>Loading</h4>;
                                    if(error) console.log(error);
                                    console.log(data);
                                    const tableRows = [];

                                    data && data.korisnik && data.korisnik.forEach((korisnik) => {
                                        tableRows.push(<TableRow key={korisnik.id} onClick={() => this.openKorisnikModal(korisnik)}>
                                            <TableCell component="th" scope="row">
                                                {korisnik.maticniBroj}
                                            </TableCell>
                                            <TableCell align="right">{`${korisnik.ime} ${korisnik.prezime}`}</TableCell>
                                            <TableCell align="right">{korisnik.uloga && korisnik.uloga.nazivUloge}</TableCell>
                                        </TableRow>)
                                    });

                                    return tableRows;
                                }
                            }
                        </Query>
                    </TableBody>
                </Table>
                <Korisnik
                    open={this.state.korisnikDialogOpen}
                    data={this.state.korisnikDialogData}
                >
                </Korisnik>
            </Card>
        )
    }
}

export default Korisnici;