import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { connect } from 'react-redux';

import { logIn, logOut } from './app/store.js';

import './App.css';

import LogList from './views/LogList.js';
import NewEntry from './views/NewEntry.js';
import Auth from './views/Auth.js';
import NewUser from './views/NewUser.js';
import PassReset from './views/PassReset.js';
import Profile from './views/Profile.js';
import PDFService from './services/PDFService.js';

// PDF library options: pdfmake, jsPDF, PDFkit.

import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import {
    Container,
    AppBar,
    Toolbar,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Paper,
    Button,
    Box,
    CssBaseline,
    IconButton,
    Menu,
    MenuItem,
} from '@material-ui/core';

import { AccountCircle, Add } from '@material-ui/icons';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#b71c1c',
        },
        secondary: {
            main: '#303f9f',
        },
    },
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuAnchor: null,
        };

        this.signOut = this.signOut.bind(this);
        this.genPdf = this.genPdf.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.logIn(user.uid);
            } else {
                this.props.logOut();
            }
        });
    }

    signOut() {
        firebase.auth().signOut();
    }

    genPdf() {
        var pdf = new PDFService(this.props.uid);
        pdf.genPDF();
    }

    openMenu(event) {
        this.setState({
            menuAnchor: event.currentTarget,
        });
    }

    closeMenu() {
        this.setState({
            menuAnchor: null,
        });
    }

    render() {
        console.log(this.props.uid ? 'Logged in.' : 'Logged out.');
        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <AppBar position='static'>
                        <Toolbar variant='dense' className='toolbar'>
                            <Link to='/' className='notUnderlined notALink appBarTitle'>
                                <Box display='flex' flexDirection='row'>
                                    <Typography variant='h6'>Logbook</Typography>
                                    <Typography variant='subtitle2'>&beta;</Typography>
                                </Box>
                            </Link>
                            {/*
                        <Button variant='outlined' onClick={this.genPdf}>
                            Generate PDF
                        </Button>
                        <Link to='/new' className='notUnderlined'>
                            <Button variant='outlined'>New Entry</Button>
                        </Link>
                        <Box ml={2}>
                            <Link to='/' className='notUnderlined'>
                                <Button variant='outlined' onClick={this.signOut}>
                                    Sign Out
                                </Button>
                            </Link>
                        </Box>
                        */}
                            {this.props.uid && (
                                <React.Fragment>
                                    <Link to='/new' className='notALink'>
                                        <IconButton color='inherit'>
                                            <Add />
                                        </IconButton>
                                    </Link>
                                    <IconButton onClick={this.openMenu} color='inherit'>
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu
                                        anchorEl={this.state.menuAnchor}
                                        keepMounted
                                        open={Boolean(this.state.menuAnchor)}
                                        onClose={this.closeMenu}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <Link to='/profile' className='notALinkBlack'>
                                            <MenuItem onClick={this.closeMenu}>Profile</MenuItem>
                                        </Link>
                                        <MenuItem
                                            onClick={() => {
                                                this.closeMenu();
                                                this.genPdf();
                                            }}
                                        >
                                            Generate PDF Report
                                        </MenuItem>
                                        <Link to='/' className='notALinkBlack'>
                                            <MenuItem
                                                onClick={() => {
                                                    this.closeMenu();
                                                    this.signOut();
                                                }}
                                            >
                                                Sign Out
                                            </MenuItem>
                                        </Link>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </Toolbar>
                    </AppBar>
                    <Switch>
                        <Route path='/addUser'>
                            <NewUser />
                        </Route>
                        <Route path='/resetPass'>
                            <PassReset />
                        </Route>
                        {/* TODO: If not logged in, always redirect to /.*/}
                        {this.props.uid && (
                            <Route path='/list'>
                                <LogList />
                            </Route>
                        )}
                        {this.props.uid && (
                            <Route path='/new'>
                                <NewEntry />
                            </Route>
                        )}
                        {this.props.uid && (
                            <Route path='/profile'>
                                <Profile />
                            </Route>
                        )}
                        <Route path='/'>{this.props.uid ? <Redirect to='/list' /> : <Auth />}</Route>
                    </Switch>
                    <Box mt={4}>
                        <Typography variant='body2' align='center'>
                            &copy; 2020 David Olmstead
                        </Typography>
                    </Box>
                </Router>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    uid: state,
});

const mapDispatchToProps = {
    logIn,
    logOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
