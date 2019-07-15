import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import {Query} from 'react-apollo';
import MaterialTable from 'material-table';
import ZahtjevInfo from './ZahtjevInfo';
import { PROFESOR_ZAHTJEV_QUERY, STUDENT_ZAHTJEV_QUERY, SPECIFIC_ZAHTJEV_QUERY } from '../apollo/queries';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {Typography} from "@material-ui/core";
import AuthContext from '../context/authContext';

export class Zahtjevi extends Component {

    static contextType = AuthContext;

    componentWillMount() {
        if(this.context.korisnikUlogaId === '2'){
            this.setState({ prikaz: 'zahtjeviNaCekanju' });
        } else {
            this.setState({ prikaz: 'odobreniZahtjevi' });
        }
    }

    constructor(props) {
        super(props);

        this.state = {
          prikaz: null
        };
    }

    render() {
        return (
            <Card>
                <React.Fragment>
                    <Tabs value={this.state.prikaz} onChange={(e, value) => this.setState({ prikaz: value })}>
                        {this.context.korisnikUlogaId === '2' && (<Tab value="zahtjeviNaCekanju" label="Zahtjevi Na Čekanju" wrapped />)}
                        <Tab value="odobreniZahtjevi" label="Odobreni zahtjevi" />
                        <Tab value="mojiZahtjevi" label="Moji zahtjevi" />
                    </Tabs>
                    {this.state.prikaz === 'mojiZahtjevi' ?
                        this.context.korisnikUlogaId === '1' ? (<Query query={STUDENT_ZAHTJEV_QUERY} variables={{ korisnikId: this.context.korisnikId }} notifyOnNetworkStatusChange >
                            {
                                ({loading, error, data}) => {
                                    if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                    if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                    
                                    const tableRows = [];
                                    data && data.zahtjevPosudbe && data.zahtjevPosudbe.forEach((zahtjevPosudbe) => {
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
                        </Query>) : (<Query query={PROFESOR_ZAHTJEV_QUERY} variables={{ odobritelj: this.context.korisnikId }} notifyOnNetworkStatusChange >
                            {
                                ({loading, error, data}) => {
                                    if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                    if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;

                                    const tableRows = [];
                                    data && data.zahtjevPosudbe && data.zahtjevPosudbe.forEach((zahtjevPosudbe) => {
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