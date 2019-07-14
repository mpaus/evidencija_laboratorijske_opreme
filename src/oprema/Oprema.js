import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import {Query} from 'react-apollo';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { UREDAJ_QUERY, AVAILABLE_UREDAJ_QUERY } from '../apollo/queries';
import MaterialTable from 'material-table';
import Uredaj from './Uredaj';
import UredajInfo from './UredajInfo';
import CreateZahtjev from '../zahtjevPosudbe/CreateZahtjev';
import {Typography} from "@material-ui/core";
import DeleteUredaj from './DeleteUredaj';
export class Oprema extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deleteDialogOpen: false,
            dialogOpen: false,
            uredajInfo: null,
            deleteUredajId: null,
            createZahtjevDialogOpen: false,
            prikaz: 'dostupniUredaji',
        };

        this.setZahtjevDialogOpen = this.setZahtjevDialogOpen.bind(this);
        this.updateUredajInfoState = this.updateUredajInfoState.bind(this);
        this.updateZahtjevState = this.updateZahtjevState.bind(this);
        this.updateDeleteDialogOpenState = this.updateDeleteDialogOpenState.bind(this);
    }

    setZahtjevDialogOpen = (state) => {
        this.setState({
            createZahtjevDialogOpen: state
        });
    };

    updateDeleteDialogOpenState = (state) => {
        this.setState({
            deleteDialogOpen: state
        })
    };

    updateUredajInfoState = (state) => {
        this.setState({
            dialogOpen: state
        })
    };

    updateZahtjevState = (state, dialogState) => {
        this.setState({
            uredajInfo: state,
            createZahtjevDialogOpen: dialogState
        })
    };

    render() {
        return (
            <Card>
                    <Tabs value={this.state.prikaz} onChange={(e, value) => this.setState({ prikaz: value })}>
                        <Tab value="dostupniUredaji" label="Dostupni uređaji" wrapped />
                        <Tab value="sviUredaji" label="Svi uređaji" />
                    </Tabs>
                        {this.state.prikaz === 'sviUredaji' ?
                            (<Query query={UREDAJ_QUERY}>
                        {
                            ({loading, error, data}) => {
                                if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                const tableRows = [];
                                data && data.uredaj && data.uredaj.forEach((uredaj) => {
                                    tableRows.push({
                                        serijskiBroj: uredaj.serijskiBroj,
                                        nazivUredaja: uredaj.nazivUredaja,
                                        kategorija: uredaj.kategorija && uredaj.kategorija.nazivKategorije,
                                        stanje: uredaj.stanje && uredaj.stanje.nazivStanja
                                    })
                                });
                                return (<MaterialTable
                                    columns={[
                                        {title: "Serijski broj", field: "serijskiBroj"},
                                        {title: "Naziv uređaja", field: "nazivUredaja"},
                                        {title: "Kategorija", field: "kategorija"},
                                        {title: "Stanje", field: "stanje"}
                                    ]}
                                    data={tableRows}
                                    title="Oprema"
                                    detailPanel={rowData => {
                                        const odabraniUredaj = data.uredaj.filter(uredaj => uredaj.serijskiBroj === rowData.serijskiBroj);
                                        return (
                                            <Uredaj
                                                data={odabraniUredaj[0]}
                                                zahtjevState={this.updateZahtjevState}
                                            >
                                            </Uredaj>
                                        )
                                    }}
                                    actions={[
                                        {
                                            icon: 'create',
                                            tooltip: 'Izmjeni uređaj',
                                            onClick: (event, rowData) => {
                                                const odabraniUredaj = data.uredaj.filter(uredaj => uredaj.serijskiBroj === rowData.serijskiBroj);
                                                return this.setState({ dialogOpen: true, uredajInfo: odabraniUredaj[0] })
                                            }
                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Izbriši uređaj',
                                            onClick: (event, rowData) => {
                                                const odabraniUredaj = data.uredaj.filter(uredaj => uredaj.serijskiBroj === rowData.serijskiBroj);
                                                return this.setState({ deleteDialogOpen: true, deleteUredajId: odabraniUredaj[0].id })
                                            }
                                        },
                                        {
                                            icon: 'add_box',
                                            tooltip: 'Dodaj uređaj',
                                            isFreeAction: true,
                                            onClick: () => this.setState({ dialogOpen: true, uredajInfo: null } )
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
                            (<Query query={AVAILABLE_UREDAJ_QUERY} variables={{ stanjeId: 1 }}>
                                {
                                    ({loading, error, data}) => {
                                        if (loading) return <Typography style={{ padding: '5px' }}>Učitavanje...</Typography>;
                                        if (error) return <Typography style={{ padding: '5px' }}>{error}</Typography>;
                                        const tableRows = [];
                                        data && data.uredaj && data.uredaj.forEach((uredaj) => {
                                            tableRows.push({
                                                serijskiBroj: uredaj.serijskiBroj,
                                                nazivUredaja: uredaj.nazivUredaja,
                                                kategorija: uredaj.kategorija && uredaj.kategorija.nazivKategorije,
                                                stanje: uredaj.stanje && uredaj.stanje.nazivStanja
                                            })
                                        });
                                        return (<MaterialTable
                                            columns={[
                                                {title: "Serijski broj", field: "serijskiBroj"},
                                                {title: "Naziv uređaja", field: "nazivUredaja"},
                                                {title: "Kategorija", field: "kategorija"},
                                                {title: "Stanje", field: "stanje"}
                                            ]}
                                            data={tableRows}
                                            title="Oprema"
                                            detailPanel={rowData => {
                                                const odabraniUredaj = data.uredaj.filter(uredaj => uredaj.serijskiBroj === rowData.serijskiBroj);
                                                return (
                                                    <Uredaj
                                                        data={odabraniUredaj[0]}
                                                        zahtjevState={this.updateZahtjevState}
                                                    >
                                                    </Uredaj>
                                                )
                                            }}
                                            actions={[
                                                {
                                                    icon: 'create',
                                                    tooltip: 'Izmjeni uređaj',
                                                    onClick: (event, rowData) => {
                                                        const odabraniUredaj = data.uredaj.filter(uredaj => uredaj.serijskiBroj === rowData.serijskiBroj);
                                                        return this.setState({ dialogOpen: true, uredajInfo: odabraniUredaj[0] })
                                                    }
                                                },
                                                {
                                                    icon: 'delete',
                                                    tooltip: 'Izbriši uređaj',
                                                    onClick: (event, rowData) => {
                                                        const odabraniUredaj = data.uredaj.filter(uredaj => uredaj.serijskiBroj === rowData.serijskiBroj);
                                                        return this.setState({ deleteDialogOpen: true, deleteUredajId: odabraniUredaj[0].id })
                                                    }
                                                },

                                                {
                                                    icon: 'add_box',
                                                    tooltip: 'Dodaj uređaj',
                                                    isFreeAction: true,
                                                    onClick: () => this.setState({ dialogOpen: true, uredajInfo: null })
                                                }
                                            ]}
                                            options={{
                                                actionsColumnIndex: -1
                                            }}
                                        />);
                                    }
                                }
                            </Query>)}
                <UredajInfo
                    open={this.state.dialogOpen}
                    prikaz={this.state.prikaz}
                    uredajInfo={this.state.uredajInfo}
                    uredajInfoState={this.updateUredajInfoState}
                />
                <DeleteUredaj
                    open={this.state.deleteDialogOpen}
                    prikaz={this.state.prikaz}
                    updateDeleteDialogOpenState={this.updateDeleteDialogOpenState}
                    deleteUredajId={this.state.deleteUredajId}
                />
                <CreateZahtjev
                  open={this.state.createZahtjevDialogOpen}
                  setZahtjevDialogOpen={this.setZahtjevDialogOpen}
                  data={this.state.uredajInfo}
                />
            </Card>
        )
    }
}

export default Oprema;