import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Composer from 'react-composer';
import {Query,Mutation} from 'react-apollo';
import { UREDAJ_QUERY } from '../apollo/queries';
import MaterialTable from 'material-table';
import Uredaj from '../oprema/Uredaj';
import ZahtjevInfo from './ZahtjevInfo';
import CreateZahtjev from './CreateZahtjev';
import { ZAHTJEV_QUERY, SPECIFIC_ZAHTJEV_QUERY } from '../apollo/queries';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {Typography} from "@material-ui/core";

export class Zahtjevi extends Component {

    constructor(props) {
        super(props);

        this.state = {
          prikaz: 'zahtjeviUDogovoru'
        };
    }

    render() {
        return (
            <Card>
                <React.Fragment>
                    <Tabs value={this.state.prikaz} onChange={(e, value) => this.setState({ prikaz: value })}>
                        <Tab value="zahtjeviUDogovoru" label="Zahtjevi u dogovoru" wrapped />
                        <Tab value="odobreniZahtjevi" label="Odobreni zahtjevi" />
                        <Tab value="sviZahtjevi" label="Svi zahtjevi" />
                    </Tabs>
                    {this.state.prikaz === 'sviZahtjevi' ?
                        (<Query query={ZAHTJEV_QUERY}>
                            {
                                ({loading, error, data}) => {
                                    if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                    if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                    const tableRows = [];
                                    data && data.zahtjevPosudbe && data.zahtjevPosudbe.forEach((zahtjevPosudbe) => {
                                        console.log(zahtjevPosudbe.stanje);
                                        tableRows.push({
                                            student: `${zahtjevPosudbe.korisnik.ime} ${zahtjevPosudbe.korisnik.prezime}`,
                                            uredaj: zahtjevPosudbe.uredaj.nazivUredaja,
                                            brojZahtjeva: zahtjevPosudbe.id,
                                            datum: `${zahtjevPosudbe.pocetakPosudbe} - ${zahtjevPosudbe.krajPosudbe}`,
                                            stanje: zahtjevPosudbe.stanje.nazivStanja
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
                        </Query>)
                        :
                        this.state.prikaz === 'odobreniZahtjevi' ?
                            (<Query query={SPECIFIC_ZAHTJEV_QUERY} variables={{ stanjeId: 12 }}>
                                {
                                    ({loading, error, data}) => {
                                        if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                        if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                        const tableRows = [];
                                        data && data.zahtjevPosudbe && data.zahtjevPosudbe.forEach((zahtjevPosudbe) => {
                                            console.log(zahtjevPosudbe.stanje);
                                            tableRows.push({
                                                student: `${zahtjevPosudbe.korisnik.ime} ${zahtjevPosudbe.korisnik.prezime}`,
                                                uredaj: zahtjevPosudbe.uredaj.nazivUredaja,
                                                brojZahtjeva: zahtjevPosudbe.id,
                                                datum: `${zahtjevPosudbe.pocetakPosudbe} - ${zahtjevPosudbe.krajPosudbe}`,
                                                stanje: zahtjevPosudbe.stanje.nazivStanja
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
                            </Query>)
                            :
                            (<Query query={SPECIFIC_ZAHTJEV_QUERY} variables={{ stanjeId: 11 }}>
                                {
                                    ({loading, error, data}) => {
                                        if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                        if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                        const tableRows = [];
                                        data && data.zahtjevPosudbe && data.zahtjevPosudbe.forEach((zahtjevPosudbe) => {
                                            console.log(zahtjevPosudbe.stanje);
                                            tableRows.push({
                                                student: `${zahtjevPosudbe.korisnik.ime} ${zahtjevPosudbe.korisnik.prezime}`,
                                                uredaj: zahtjevPosudbe.uredaj.nazivUredaja,
                                                brojZahtjeva: zahtjevPosudbe.id,
                                                datum: `${zahtjevPosudbe.pocetakPosudbe} - ${zahtjevPosudbe.krajPosudbe}`,
                                                stanje: zahtjevPosudbe.stanje.nazivStanja
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
                            </Query>)}
                </React.Fragment>
            </Card>
        )
    }
}

export default Zahtjevi;