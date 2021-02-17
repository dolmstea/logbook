import React from 'react';

import { connect } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/firestore';

import {
    Container,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    IconButton,
    Collapse,
    List,
    ListItem,
    ListSubheader,
    Chip,
    ListItemText,
    withWidth,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';

import { KeyboardArrowUp, KeyboardArrowDown, Edit, Delete, Cancel } from '@material-ui/icons';

import { Alert, AlertTitle } from '@material-ui/lab';

import { red } from '@material-ui/core/colors';

import { withRouter } from 'react-router';

import Loading from './Loading.js';

//TODO: Sort by date added.
//FIXME: If you delete all the entries for a given date, the date header still stays on the screen.

class LogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: {},
            expanded: [],
            dateExpanded: [],
            armed: [],
            isLoading: true,
            isEmpty: false,
        };

        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.armDelete = this.armDelete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    componentDidMount() {
        var db = firebase.firestore();

        db.collection(this.props.uid)
            .orderBy('dateAdded')
            .get()
            .then((qs) => {
                var logs = {};

                qs.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    data.collapsed = false;
                    if (data.date in logs) {
                        logs[data.date].push(data);
                    } else {
                        logs[data.date] = [data];
                    }
                });

                this.setState({
                    logs: logs,
                    isLoading: false,
                    isEmpty: Object.keys(logs).length === 0 ? true : false,
                });
            });
    }

    toggleCollapse(key, mode) {
        var exp = mode === 'log' ? this.state.expanded : this.state.dateExpanded;

        if (exp.includes(key)) {
            var index = exp.indexOf(key);
            exp.splice(index, 1);
        } else {
            exp.push(key);
        }

        this.setState({
            expanded: exp,
        });
    }

    handleEdit(log) {
        this.props.history.push('/edit', log);
    }

    armDelete(id) {
        var newArmed = this.state.armed;
        newArmed.push(id);
        this.setState({
            armed: newArmed,
        });
    }

    async handleDelete(date, id) {
        this.setState({
            isLoading: true,
        });

        var db = firebase.firestore();

        await db.collection(this.props.uid).doc(id).delete();

        var logs = this.state.logs;

        for (var i of logs[date]) {
            if (i.id === id) {
                logs[date].splice(logs[date].indexOf(i), 1);
            }
        }

        for (var d in logs) {
            if (logs[d].length === 0) {
                delete logs[d];
            }
        }

        this.setState({
            logs: logs,
            isLoading: false,
        });
    }

    cancelDelete(id) {
        var newArmed = this.state.armed;

        newArmed.splice(newArmed.indexOf(id), 1);

        this.setState({
            armed: newArmed,
        });
    }

    //TODO: This may not put all the logs in the right order.

    render() {
        var dates = Object.keys(this.state.logs);
        dates.sort();
        dates.reverse();

        if (this.state.isLoading) {
            return <Loading />;
        } else {
            return (
                <Container maxWidth='md'>
                    <Box mt={2}>
                        {Object.keys(this.state.logs).length === 0 ? (
                            <Alert severity='info'>
                                <AlertTitle>Welcome.</AlertTitle>
                                Add your first log entry by clicking the plus sign at the top right of the screen.
                            </Alert>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table size='small'>
                                    {dates.map((date) => (
                                        <React.Fragment>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{date || 'No Date'}</TableCell>

                                                    <TableCell align='right'>
                                                        {this.state.dateExpanded.includes(date) && 'Age'}
                                                    </TableCell>
                                                    <TableCell align='right'>
                                                        {this.state.dateExpanded.includes(date) && 'ASA'}
                                                    </TableCell>
                                                    {this.props.width !== 'xs' && (
                                                        <TableCell align='right'>
                                                            {this.state.dateExpanded.includes(date) && 'Location'}
                                                        </TableCell>
                                                    )}
                                                    {this.props.width !== 'xs' && (
                                                        <TableCell align='right'>
                                                            {this.state.dateExpanded.includes(date) && 'Staff'}
                                                        </TableCell>
                                                    )}

                                                    <TableCell align='right'>
                                                        <IconButton
                                                            size='small'
                                                            onClick={() => {
                                                                this.toggleCollapse(date, 'date');
                                                            }}
                                                        >
                                                            {this.state.dateExpanded.includes(date) ? (
                                                                <KeyboardArrowUp color='primary' />
                                                            ) : (
                                                                <KeyboardArrowDown color='primary' />
                                                            )}
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {this.state.dateExpanded.includes(date) && (
                                                <TableBody>
                                                    {this.state.logs[date].map((log) => (
                                                        <React.Fragment>
                                                            <TableRow>
                                                                <TableCell>{log.case}</TableCell>
                                                                <TableCell align='right'>{log.age}</TableCell>
                                                                <TableCell align='right'>
                                                                    {log.asa}
                                                                    {log.e ? 'E' : ''}
                                                                </TableCell>
                                                                {this.props.width !== 'xs' && (
                                                                    <TableCell align='right'>{log.location}</TableCell>
                                                                )}
                                                                {this.props.width !== 'xs' && (
                                                                    <TableCell align='right'>{log.staff}</TableCell>
                                                                )}
                                                                <TableCell align='right'>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            this.toggleCollapse(log.id, 'log');
                                                                        }}
                                                                    >
                                                                        {this.state.expanded.includes(log.id) ? (
                                                                            <KeyboardArrowUp />
                                                                        ) : (
                                                                            <KeyboardArrowDown />
                                                                        )}
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                            {this.state.expanded.includes(log.id) && (
                                                                <TableRow>
                                                                    <TableCell colSpan={6}>
                                                                        <Collapse
                                                                            unmountOnExit
                                                                            in={this.state.expanded.includes(log.id)}
                                                                        >
                                                                            <List>
                                                                                <Grid container justify='space-between'>
                                                                                    <Grid item>
                                                                                        <ListSubheader>
                                                                                            Details
                                                                                        </ListSubheader>
                                                                                    </Grid>
                                                                                    <Grid item>
                                                                                        <IconButton
                                                                                            onClick={() => {
                                                                                                this.handleEdit(log);
                                                                                            }}
                                                                                        >
                                                                                            <Edit />
                                                                                        </IconButton>

                                                                                        {this.state.armed.includes(
                                                                                            log.id
                                                                                        ) ? (
                                                                                            <React.Fragment>
                                                                                                <IconButton
                                                                                                    onClick={() => {
                                                                                                        this.handleDelete(
                                                                                                            date,
                                                                                                            log.id
                                                                                                        );
                                                                                                    }}
                                                                                                    style={{
                                                                                                        color: red[500],
                                                                                                    }}
                                                                                                >
                                                                                                    <Delete />
                                                                                                </IconButton>
                                                                                                <IconButton
                                                                                                    onClick={() => {
                                                                                                        this.cancelDelete(
                                                                                                            log.id
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    <Cancel />
                                                                                                </IconButton>
                                                                                            </React.Fragment>
                                                                                        ) : (
                                                                                            <IconButton
                                                                                                onClick={() => {
                                                                                                    this.armDelete(
                                                                                                        log.id
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <Delete />
                                                                                            </IconButton>
                                                                                        )}
                                                                                    </Grid>
                                                                                </Grid>
                                                                                {this.props.width === 'xs' && (
                                                                                    <React.Fragment>
                                                                                        <ListItem>
                                                                                            <ListItemText primary='Location: ' />
                                                                                            {log.location !== '' && (
                                                                                                <Chip
                                                                                                    label={log.location}
                                                                                                />
                                                                                            )}
                                                                                        </ListItem>
                                                                                        <ListItem>
                                                                                            <ListItemText primary='Staff: ' />
                                                                                            {log.staff !== '' && (
                                                                                                <Chip
                                                                                                    label={log.staff}
                                                                                                />
                                                                                            )}
                                                                                        </ListItem>
                                                                                    </React.Fragment>
                                                                                )}
                                                                                <ListItem>
                                                                                    <ListItemText primary='Service: ' />
                                                                                    {log.service !== '' && (
                                                                                        <Chip label={log.service} />
                                                                                    )}
                                                                                </ListItem>
                                                                                <ListItem>
                                                                                    <ListItemText primary='Anesthetic Type: ' />
                                                                                    {log.type.map((el) => (
                                                                                        <Box ml={1}>
                                                                                            <Chip label={el} />
                                                                                        </Box>
                                                                                    ))}
                                                                                </ListItem>
                                                                                <ListItem>
                                                                                    <ListItemText primary='Procedures: ' />
                                                                                    {log.procedures.map((el) => (
                                                                                        <Box ml={1}>
                                                                                            <Chip label={el} />
                                                                                        </Box>
                                                                                    ))}
                                                                                </ListItem>
                                                                                <ListItem>
                                                                                    <ListItemText primary='EPAs: ' />
                                                                                    {log.epas.map((el) => (
                                                                                        <Box mr={1}>
                                                                                            <Chip label={el} />
                                                                                        </Box>
                                                                                    ))}
                                                                                </ListItem>
                                                                                <ListItem>
                                                                                    <ListItemText primary='Comments: ' />
                                                                                    {log.comments !== '' && (
                                                                                        <Chip label={log.comments} />
                                                                                    )}
                                                                                </ListItem>
                                                                            </List>
                                                                        </Collapse>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </TableBody>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </Container>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    uid: state,
});

const HOCLogList = withRouter(LogList);

export default connect(mapStateToProps, null)(withWidth()(HOCLogList));
