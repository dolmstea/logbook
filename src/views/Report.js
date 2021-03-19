import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import {
    Container,
    Box,
    Typography,
    Card,
    TextField,
    Button,
    CardContent,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@material-ui/core';

import { styled } from '@material-ui/core/styles';

import { PieChart, Pie, Legend, Cell, Label, LabelList } from 'recharts';

import './Report.css';

/*
prototype = {
    date: [
        {date:, other shit:, },
        {date:, other shit:, },
    ]
}
*/

const data = [
    { name: 'ASA I', value: 3 },
    { name: 'ASA II', value: 22 },
    { name: 'ASA III', value: 30 },
    { name: 'ASA IV', value: 8 },
    { name: 'ASA V', value: 12 },
    { name: 'ASA VI', value: 1 },
];

const colours = ['#9c27b0', '#2196f3', '#4caf50', '#ff9800', '#f44336', '#795548'];

const CTableCell = styled(TableCell)({
    fontSize: '0.7rem',
    paddingInline: '8px'
});

const CTableContainer = styled(TableContainer)({
    marginTop: '25px',
    pageBreakInside: 'avoid'
});

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logsByDate: {},
            totalCases: 0,
            generalCases: 0,
            spinalCases: 0,
            intubations: 0,
            spinals: 0,
            epidurals: 0,
            ivs: 0,
            artLines: 0,
            centralLines: 0,
            asa1: 0,
            asa2: 0,
            asa3: 0,
            asa4: 0,
            asa5: 0,
        };
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;

        var db = firebase.firestore();

        db.collection(user.uid)
            .orderBy('date')
            .get()
            .then((qs) => {
                var logsByDate = {};

                var totalCases = 0;
                var generalCases = 0;
                var spinalCases = 0;
                var intubations = 0;
                var spinals = 0;
                var epidurals = 0;
                var ivs = 0;
                var artLines = 0;
                var centralLines = 0;

                var asa1 = 0;
                var asa2 = 0;
                var asa3 = 0;
                var asa4 = 0;
                var asa5 = 0;

                qs.forEach((doc) => {
                    const data = doc.data();

                    if (data.date in logsByDate) {
                        logsByDate[data.date].push(data);
                    } else {
                        logsByDate[data.date] = [data];
                    }
                });

                for (var date in logsByDate) {
                    logsByDate[date].sort((a, b) => {
                        return a.dateAdded - b.dateAdded;
                    });

                    for (var index in logsByDate[date]) {
                        var log = logsByDate[date][index];

                        totalCases++;

                        if (log.type.includes('GA')) {
                            generalCases++;
                        }
                        if (log.type.includes('Spinal')) {
                            spinalCases++;
                        }

                        if (log.procedures.includes('Intubation')) {
                            intubations++;
                        }
                        if (log.procedures.includes('Spinal')) {
                            spinals++;
                        }
                        if (log.procedures.includes('IV')) {
                            ivs++;
                        }
                        if (log.procedures.includes('Art Line')) {
                            artLines++;
                        }
                        if (log.procedures.includes('Central Line')) {
                            centralLines++;
                        }

                        switch (log.asa) {
                            case '1':
                                asa1++;
                                break;
                            case '2':
                                asa2++;
                                break;
                            case '3':
                                asa3++;
                                break;
                            case '4':
                                asa4++;
                                break;
                            case '5':
                                asa5++;
                                break;
                        }
                    }
                }

                this.setState({
                    logsByDate: logsByDate,
                    totalCases: totalCases,
                    generalCases: generalCases,
                    spinalCases: spinalCases,
                    intubations: intubations,
                    spinals: spinals,
                    epidurals: epidurals,
                    ivs: ivs,
                    artLines: artLines,
                    centralLines: centralLines,
                    asa1: asa1,
                    asa2: asa2,
                    asa3: asa3,
                    asa4: asa4,
                    asa5: asa5,
                });
            });
    }

    render() {
        return (
            <Container>
                <Typography variant='h4'>Anesthesia Logbook Report</Typography>
                <Typography variant='h6' align='right'>
                    David Olmstead
                </Typography>
                <Typography variant='subtitle2' align='right'>
                    January 21, 2021 - March 31, 2022
                </Typography>
                <Typography variant='subtitle1'>Summary Data</Typography>
                <Grid container spacing={3} alignItems='stretch'>
                    <Grid item xs={4}>
                        <TableContainer component={Card} variant='outlined' className='fillparent'>
                            <Table size='small'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Total Cases</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>GA Cases</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Neuraxial/Regional</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Intubations</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Spinals</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Epidurals</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>IVs</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Arterial Lines</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Central Lines</TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={8}>
                        <Card variant='outlined' className='fillparent'>
                            <CardContent>
                                <PieChart width={400} height={240}>
                                    <Pie data={data} dataKey='value' nameKey='name' label>
                                        {/*<LabelList dataKey='value' position='inside' />*/}
                                        {data.map((entry, index) => (
                                            <Cell fill={colours[index]} />
                                        ))}
                                    </Pie>
                                    <Legend align='right' verticalAlign='middle' layout='vertical' />
                                </PieChart>
                            </CardContent>
                        </Card>
                    </Grid>
                    </Grid>
                    {Object.keys(this.state.logsByDate).map((date) => (
                        
                            <CTableContainer component={Card} variant='outlined' className='tablecontainer'>
                                <Table size='small' className='table'>
                                    <TableHead>
                                        <TableRow>
                                            <CTableCell>{date}</CTableCell>
                                            <CTableCell style={{width: '70px'}}>Age</CTableCell>
                                            <CTableCell style={{width: '50px'}}>ASA</CTableCell>
                                            <CTableCell style={{width: '100px'}}>Location</CTableCell>
                                            <CTableCell style={{width: '70px'}}>Staff</CTableCell>
                                            <CTableCell style={{width: '70px'}}>Service</CTableCell>
                                            <CTableCell style={{width: '70px'}}>Type</CTableCell>
                                            <CTableCell style={{width: '70px'}}>Procedures</CTableCell>
                                            <CTableCell style={{width: '70px'}}>EPAs</CTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.logsByDate[date].map((log) => (
                                            <React.Fragment>
                                                <TableRow>
                                                    <CTableCell>{log.case}</CTableCell>
                                                    <CTableCell>{log.age}</CTableCell>
                                                    <CTableCell>
                                                        {log.asa} {log.e && 'E'}
                                                    </CTableCell>
                                                    <CTableCell>{log.location}</CTableCell>
                                                    <CTableCell>{log.staff}</CTableCell>
                                                    <CTableCell>{log.service}</CTableCell>
                                                    <CTableCell>{log.type}</CTableCell>
                                                    <CTableCell>{log.procedures}</CTableCell>
                                                    <CTableCell>{log.epas}</CTableCell>
                                                </TableRow>
                                                {log.comments !== '' && (
                                                    <TableRow selected='true'>
                                                        <CTableCell colSpan={9}><small>Comments: {log.comments}</small></CTableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CTableContainer>
                        
                    ))}
                
            </Container>
        );
    }
}

export default Report;
