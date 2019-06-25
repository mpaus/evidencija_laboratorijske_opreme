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
import UredajInfo from './UredajInfo';
import { DELETE_UREDAJ, UPDATE_UREDAJ } from './apollo/mutations';

export class Oprema extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            uredajInfo: null
        };

        this.updateUredajInfoState = this.updateUredajInfoState.bind(this);
    }

    updateUredajInfoState = (state) => {
        this.setState({
            uredajInfo: state
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
        return (
            <Card>
                <Composer
                    components={[
                        <Mutation mutation={DELETE_UREDAJ} update={this.updateCacheDelete}/>,
                    ]}
                 >
                {([deleteUredaj]) => (
                    <Query query={UREDAJ_QUERY}>
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
                }
                </Composer>
                <UredajInfo
                    open={this.state.dialogOpen}
                    uredajInfo={this.state.uredajInfo}
                    uredajInfoState={this.updateUredajInfoState}
                />
            </Card>
        )
    }
}

export default Oprema;