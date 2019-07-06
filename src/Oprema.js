import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Composer from 'react-composer';
import {Query,Mutation} from 'react-apollo';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { UREDAJ_QUERY, AVAILABLE_UREDAJ_QUERY } from './apollo/queries';
import MaterialTable from 'material-table';
import Uredaj from './Uredaj';
import UredajInfo from './UredajInfo';
import CreateZahtjev from './CreateZahtjev';
import { DELETE_UREDAJ } from './apollo/mutations';

export class Oprema extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            uredajInfo: null,
            createZahtjevDialogOpen: false,
            prikaz: 'dostupniUredaji'
        };

        this.updateUredajInfoState = this.updateUredajInfoState.bind(this);
        this.updateZahtjevState = this.updateZahtjevState.bind(this);
    }

    updateUredajInfoState = (state) => {
        this.setState({
            uredajInfo: state
        })
    };

    updateZahtjevState = (state, dialogState) => {
        this.setState({
            uredajInfo: state,
            createZahtjevDialogOpen: dialogState
        })
    };

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
        console.log(this.state.prikaz);
        return (
            <Card>
                <Composer
                    components={[
                        <Mutation mutation={DELETE_UREDAJ} update={this.updateCacheDelete}/>,
                    ]}
                 >
                {([deleteUredaj]) => (
                    <React.Fragment>
                    <Tabs value={this.state.prikaz} onChange={(e, value) => this.setState({ prikaz: value })}>
                        <Tab value="dostupniUredaji" label="Dostupni uređaji" wrapped />
                        <Tab value="sviUredaji" label="Svi uređaji" />
                    </Tabs>
                        {this.state.prikaz === 'sviUredaji' ?
                            (<Query query={UREDAJ_QUERY}>
                        {
                            ({loading, error, data}) => {
                                if (loading) return <h4>Loading</h4>;
                                if (error) console.log(error);
                                console.log(data);
                                const tableRows = [];
                                data && data.uredaj && data.uredaj.forEach((uredaj) => {
                                    console.log(uredaj, 'ERROR');
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
                                                return deleteUredaj({
                                                                variables: {
                                                                    input: odabraniUredaj[0].id
                                                                }
                                                            })
                                            }
                                        },

                                        {
                                            icon: 'add_box',
                                            tooltip: 'Dodaj uređaj',
                                            isFreeAction: true,
                                            onClick: () => this.setState({ dialogOpen: true })
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
                                        if (loading) return <h4>Loading</h4>;
                                        if (error) console.log(error);
                                        console.log(data);
                                        const tableRows = [];
                                        data && data.uredaj && data.uredaj.forEach((uredaj) => {
                                            console.log(uredaj, 'ERROR');
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
                                                        return deleteUredaj({
                                                            variables: {
                                                                input: odabraniUredaj[0].id
                                                            }
                                                        })
                                                    }
                                                },

                                                {
                                                    icon: 'add_box',
                                                    tooltip: 'Dodaj uređaj',
                                                    isFreeAction: true,
                                                    onClick: () => this.setState({ dialogOpen: true })
                                                }
                                            ]}
                                            options={{
                                                actionsColumnIndex: -1
                                            }}
                                        />);
                                    }
                                }
                            </Query>)}
                    </React.Fragment>)
                }
                </Composer>
                <UredajInfo
                    open={this.state.dialogOpen}
                    uredajInfo={this.state.uredajInfo}
                    uredajInfoState={this.updateUredajInfoState}
                />
                <CreateZahtjev
                  open={this.state.createZahtjevDialogOpen}
                  data={this.state.uredajInfo}
                />
            </Card>
        )
    }
}

export default Oprema;