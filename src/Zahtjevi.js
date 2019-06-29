import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Composer from 'react-composer';
import {Query,Mutation} from 'react-apollo';
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
import { UREDAJ_QUERY } from './apollo/queries';
import MaterialTable from 'material-table';
import Uredaj from './Uredaj';
import ZahtjevInfo from './ZahtjevInfo';
import CreateZahtjev from './CreateZahtjev';
import { ZAHTJEV_QUERY } from './apollo/queries';

export class Zahtjevi extends Component {

    constructor(props) {
        super(props);


    }

    updateCacheDelete = (cache, { data : { DeleteUredaj: { id }}}) => {
        const { uredaj } = cache.readQuery({ query: UREDAJ_QUERY });

        console.log(id);

        cache.writeQuery({
            query: UREDAJ_QUERY,
            data: {
                uredaj: uredaj.filter(uredaj => uredaj.id !== id)
            }
        });

    };

    render() {
        return (
            <Card>
                        <Query query={ZAHTJEV_QUERY}>
                            {
                                ({loading, error, data}) => {
                                    if (loading) return <h4>Loading</h4>;
                                    if (error) console.log(error);
                                    console.log(data);
                                    const tableRows = [];
                                    data && data.zahtjevPosudbe && data.zahtjevPosudbe.forEach((zahtjevPosudbe) => {
                                        console.log(zahtjevPosudbe.stanje);
                                        tableRows.push({
                                            student: `${zahtjevPosudbe.korisnik.ime} ${zahtjevPosudbe.korisnik.prezime}`,
                                            uredaj: zahtjevPosudbe.uredaj.nazivUredaja,
                                            brojZahtjeva: zahtjevPosudbe.id,
                                            datum: `${zahtjevPosudbe.pocetakPosudbe} - ${zahtjevPosudbe.krajPosudbe}`,
                                            stanje: zahtjevPosudbe.stanje.id === '2' ? 'Novi zahtjev' : (zahtjevPosudbe.stanje.id === '3' ? 'Posuđeno' : 'Odbijeno')
                                        })
                                    });
                                    return (<MaterialTable
                                        columns={[
                                            {title: "Student", field: "student"},
                                            {title: "Uređaj", field: "uredaj"},
                                            {title: "Broj zahtjeva", field: "brojZahtjeva"},
                                            {title: "Datum", field: "datum"},
                                            {title: "Stanje", field: "stanje"}
                                        ]}
                                        data={tableRows}
                                        title="Moji zahtjevi"
                                        detailPanel={rowData => {
                                            const odabraniZahtjev = data.zahtjevPosudbe.filter(zahtjevPosudbe => zahtjevPosudbe.id === rowData.brojZahtjeva);
                                            return (
                                                <ZahtjevInfo
                                                    data={odabraniZahtjev[0]}
                                                >
                                                </ZahtjevInfo>
                                            )
                                        }}
                                    />);
                                }
                            }
                        </Query>
            </Card>
        )
    }
}

export default Zahtjevi;