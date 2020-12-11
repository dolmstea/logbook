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
    Typography,
    List,
    ListItem,
    ListSubheader,
    Chip,
    ListItemText,
    withWidth,
} from '@material-ui/core';

import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';

class LogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: {},
            expanded: [],
        };

        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount() {
        var db = firebase.firestore();

        db.collection(this.props.uid)
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
                });
            });
    }

    toggleCollapse(key) {
        var exp = this.state.expanded;

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

    //TODO: This may not put all the logs in the right order.

    render() {
        var dates = Object.keys(this.state.logs);
        dates.sort();

        console.log(this.props.width);

        return (
            <Container maxWidth='sm'>
                <Box mt={2}>
                    <TableContainer component={Paper}>
                        <Table size='small'>
                            {dates.map((date) => (
                                //<Box mt={2}>
                                //<TableContainer component={Paper}>
                                //<Table size='small'>
                                <React.Fragment>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{date || 'No Date'}</TableCell>
                                            <TableCell align='right'>Age</TableCell>
                                            <TableCell align='right'>ASA</TableCell>
                                            {this.props.width !== 'xs' && <TableCell align='right'>Location</TableCell>}
                                            {this.props.width !== 'xs' && <TableCell align='right'>Staff</TableCell>}
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
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
                                                                this.toggleCollapse(log.id);
                                                            }}
                                                        >
                                                            <KeyboardArrowDown />
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
                                                                    <ListSubheader>Details</ListSubheader>
                                                                    {this.props.width === 'xs' && (
                                                                        <React.Fragment>
                                                                            <ListItem>
                                                                                <ListItemText primary='Location: ' />
                                                                                {log.location !== '' && (
                                                                                    <Chip label={log.location} />
                                                                                )}
                                                                            </ListItem>
                                                                            <ListItem>
                                                                                <ListItemText primary='Staff: ' />
                                                                                {log.staff !== '' && (
                                                                                    <Chip label={log.staff} />
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
                                </React.Fragment>
                                //</Table>
                                //</TableContainer>
                                //</Box>
                            ))}
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    uid: state,
});

export default connect(mapStateToProps, null)(withWidth()(LogList));
