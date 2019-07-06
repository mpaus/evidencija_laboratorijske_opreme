import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import {Query} from 'react-apollo';
import Korisnik from './Korisnik';
import {KORISNIK_QUERY} from '../apollo/queries';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import MaterialTable from "material-table";
import {Typography} from "@material-ui/core";
import DeleteKorisnik from "./DeleteKorisnik";

export class Korisnici extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            deleteKorisnikId: null,
            deleteKorisnikUlogaId: null,
            prikaz: 'studenti'
        };

        this.updateDialogOpenState = this.updateDialogOpenState.bind(this);
    }

    updateDialogOpenState = (state) => {
        this.setState({
            dialogOpen: state
        })
    };

    render() {
        return (
            <Card>
                <Tabs value={this.state.prikaz} onChange={(e, value) => this.setState({ prikaz: value })}>
                    <Tab value="studenti" label="Studenti" wrapped />
                    <Tab value="profesori" label="Profesori" />
                </Tabs>
                {this.state.prikaz === 'studenti' ?
                    (<Query query={KORISNIK_QUERY} variables={{ ulogaId: 1 }}>
                        {
                            ({loading, error, data}) => {
                                if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                console.log(data, 'STUDENTI');
                                const tableRows = [];
                                data && data.korisnik && data.korisnik.forEach((korisnik) => {
                                    tableRows.push({
                                        maticniBroj: korisnik.maticniBroj,
                                        imeIPrezime: `${korisnik.ime} ${korisnik.prezime}`,
                                        uloga: korisnik.uloga && korisnik.uloga.nazivUloge,
                                    })
                                });
                                return (<MaterialTable
                                    columns={[
                                        {title: "Matični broj", field: "maticniBroj"},
                                        {title: "Ime i prezime", field: "imeIPrezime"},
                                        {title: "Uloga", field: "uloga"},
                                    ]}
                                    data={tableRows}
                                    title="STUDENTI"
                                    detailPanel={rowData => {
                                        const odabraniStudent = data.korisnik.filter(korisnik => korisnik.maticniBroj === rowData.maticniBroj);
                                        return (
                                            <Korisnik
                                                data={odabraniStudent[0]}
                                            />
                                        )
                                    }}
                                    actions={[
                                        {
                                            icon: 'delete',
                                            tooltip: 'Izbriši studenta',
                                            onClick: (event, rowData) => {
                                                const odabraniStudent = data.korisnik.filter(korisnik => korisnik.maticniBroj === rowData.maticniBroj);
                                                return this.setState({
                                                    dialogOpen: true,
                                                    deleteKorisnikId: odabraniStudent[0].id,
                                                    deleteKorisnikUlogaId: odabraniStudent[0].ulogaId
                                                })
                                            }
                                        }
                                    ]}
                                    options={{
                                        actionsColumnIndex: -1
                                    }}
                                />);
                            }
                        }
                    </Query>)
                    :
                    (<Query query={KORISNIK_QUERY} variables={{ ulogaId: 2 }}>
                        {
                            ({loading, error, data}) => {
                                if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                console.log(data);
                                const tableRows = [];
                                data && data.korisnik && data.korisnik.forEach((korisnik) => {
                                    tableRows.push({
                                        maticniBroj: korisnik.maticniBroj,
                                        imeIPrezime: `${korisnik.ime} ${korisnik.prezime}`,
                                        uloga: korisnik.uloga && korisnik.uloga.nazivUloge,
                                    })
                                });
                                return (<MaterialTable
                                    columns={[
                                        {title: "Matični broj", field: "maticniBroj"},
                                        {title: "Ime i prezime", field: "imeIPrezime"},
                                        {title: "Uloga", field: "uloga"},
                                    ]}
                                    data={tableRows}
                                    title="PROFESORI"
                                    detailPanel={rowData => {
                                        const odabraniProfesor = data.korisnik.filter(korisnik => korisnik.maticniBroj === rowData.maticniBroj);
                                        return (
                                            <Korisnik
                                                data={odabraniProfesor[0]}
                                            />
                                        )
                                    }}
                                />);
                            }
                        }
                    </Query>)}
                    <DeleteKorisnik
                        open={this.state.dialogOpen}
                        updateDialogOpenState={this.updateDialogOpenState}
                        deleteKorisnikId={this.state.deleteKorisnikId}
                        deleteKorisnikUlogaId={this.state.deleteKorisnikUlogaId}
                    />
            </Card>
        )
    }
}

export default Korisnici;