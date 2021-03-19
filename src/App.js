//TODO: Reset password form needs a cancel button.
//TODO: Put the whole dataset in the application state/redux store.
//TODO: Could add more Collapses to the LogList.
//FIXME: When you edit a log and delete the comment, then click update, the comment is still there. I suspect the router is just going back without reloading the page. Updating the case title works though.

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { connect } from 'react-redux';

import { logIn, logOut } from './app/store.js';

import './App.css';

// PDF library options: pdfmake, jsPDF, PDFkit.

import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Button,
    ButtonGroup,
    withWidth,
} from '@material-ui/core';

import { AccountCircle, Add } from '@material-ui/icons';

import { createMuiTheme, ThemeProvider, styled } from '@material-ui/core/styles';

import LogList from './views/LogList.js';
import ProcedureList from './views/ProcedureList.js';
import NewEntry from './views/NewEntry.js';
import NewProcedure from './views/NewProcedure.js';
import EditEntry from './views/EditEntry.js';
import Auth from './views/Auth.js';
import NewUser from './views/NewUser.js';
import PassReset from './views/PassReset.js';
import Profile from './views/Profile.js';
import EditProfile from './views/EditProfile.js';
import Loading from './views/Loading.js';
import Report from './views/Report.js';
import PDFService from './services/PDFService.js';
//import JSPDFService from './services/JSPDFService.js';
//import ChartistPDFService from './services/ChartistPDFService.js';

//const LogList = React.lazy(() => import('./views/LogList.js'));
//const NewEntry = React.lazy(() => import('./views/NewEntry.js'));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0096a5',
        },
        secondary: {
            main: '#7cb342',
        },
    },
});

const CButtonGroup = styled(ButtonGroup)({
    //color: '#f5f5f5',
});

const CButton = styled(({ isActive, ...other }) => <Button {...other} />)({
    backgroundColor: (props) => props.isActive && '#56c7d6',
    borderColor: '#006876',
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuAnchor: null,
            newItemMenuAnchor: null,
            isLoading: true,
        };

        this.signOut = this.signOut.bind(this);
        this.genPdf = this.genPdf.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.openNewItemMenu = this.openNewItemMenu.bind(this);
        this.closeNewItemMenu = this.closeNewItemMenu.bind(this);

        this.stagingArea = React.createRef();

        /*
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.logIn(user.uid);
            } else {
                this.props.logOut();
            }
            this.setState({
                isLoading: false,
            });
        });
        */
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

    openNewItemMenu(event) {
        this.setState({
            newItemMenuAnchor: event.currentTarget,
        });
    }

    closeNewItemMenu() {
        this.setState({
            newItemMenuAnchor: null,
        });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.logIn(user.uid);
            } else {
                this.props.logOut();
            }
            this.setState({
                isLoading: false,
            });
        });
    }

    render() {
        //console.log(this.props.uid ? 'Logged in.' : 'Logged out.');
        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        {this.props.uid && (
                            <Route path='/report'>
                                <Report />
                            </Route>
                        )}
                        <Route path='/'>
                            <AppBar position='static'>
                                <Toolbar variant='dense' className='toolbar'>
                                    <Box flexGrow={1}>
                                        <Link to='/' className='notUnderlined notALink appBarTitle'>
                                            <Box display='flex' flexDirection='row'>
                                                <Typography variant='h6'>\\ Logbook</Typography>
                                                <Typography variant='subtitle2'>&beta;</Typography>
                                            </Box>
                                        </Link>
                                    </Box>
                                    <Route path='/list'>
                                        {this.props.uid && (
                                            <CButtonGroup color='inherit'>
                                                <CButton isActive>{this.props.width === 'xs' ? 'C' : 'Cases'}</CButton>
                                                <Link component={CButton} to='/procList'>
                                                    {this.props.width === 'xs' ? 'P' : 'Procedures'}
                                                </Link>
                                            </CButtonGroup>
                                        )}
                                    </Route>
                                    <Route path='/procList'>
                                        {this.props.uid && (
                                            <CButtonGroup color='inherit'>
                                                <Link component={CButton} to='/list'>
                                                    {this.props.width === 'xs' ? 'C' : 'Cases'}
                                                </Link>
                                                <CButton isActive>
                                                    {this.props.width === 'xs' ? 'P' : 'Procedures'}
                                                </CButton>
                                            </CButtonGroup>
                                        )}
                                    </Route>
                                    {this.props.uid && (
                                        <Box flexGrow={1} display='flex' justifyContent='flex-end'>
                                            <React.Fragment>
                                                <IconButton onClick={this.openNewItemMenu} color='inherit'>
                                                    <Add />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={this.state.newItemMenuAnchor}
                                                    keepMounted
                                                    open={Boolean(this.state.newItemMenuAnchor)}
                                                    onClose={this.closeNewItemMenu}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    <MenuItem
                                                        component={Link}
                                                        to='/newCase'
                                                        onClick={this.closeNewItemMenu}
                                                    >
                                                        Case
                                                    </MenuItem>

                                                    <MenuItem
                                                        component={Link}
                                                        to='/newProc'
                                                        onClick={this.closeNewItemMenu}
                                                    >
                                                        Procedure
                                                    </MenuItem>
                                                </Menu>
                                                <IconButton onClick={this.openMenu} color='inherit'>
                                                    <AccountCircle />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={this.state.menuAnchor}
                                                    keepMounted
                                                    open={Boolean(this.state.menuAnchor)}
                                                    onClose={this.closeMenu}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    <MenuItem onClick={this.closeMenu} component={Link} to='/profile'>
                                                        Profile
                                                    </MenuItem>

                                                    <MenuItem
                                                        onClick={() => {
                                                            const svc = new PDFService(this.props.uid);
                                                            svc.genPDF();
                                                            this.closeMenu();
                                                        }}
                                                    >
                                                        Generate PDF Report
                                                    </MenuItem>

                                                    {/*
                                                    <MenuItem
                                                        onClick={() => {
                                                            const svc = new JSPDFService(
                                                                this.props.uid,
                                                                this.stagingArea
                                                            );
                                                            svc.genPDF();
                                                            this.closeMenu();
                                                        }}
                                                    >
                                                        jsPDF
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            const svc = new ChartistPDFService(
                                                                this.props.uid,
                                                                this.stagingArea
                                                            );
                                                            svc.genPDF();
                                                            this.closeMenu();
                                                        }}
                                                    >
                                                        ChartistPDF
                                                    </MenuItem>
                                                    */}

                                                    <MenuItem
                                                        component={Link}
                                                        to='/'
                                                        onClick={() => {
                                                            this.closeMenu();
                                                            this.signOut();
                                                        }}
                                                    >
                                                        Sign Out
                                                    </MenuItem>
                                                </Menu>
                                            </React.Fragment>
                                        </Box>
                                    )}
                                </Toolbar>
                            </AppBar>
                            {this.state.isLoading ? (
                                <Loading />
                            ) : (
                                <Switch>
                                    <Route path='/loading'>
                                        {' '}
                                        {/* This is just for testing. */}
                                        <Loading />
                                    </Route>
                                    <Route path='/addUser'>
                                        <NewUser />
                                    </Route>
                                    <Route path='/resetPass'>
                                        <PassReset />
                                    </Route>
                                    {this.props.uid && (
                                        <Route path='/list'>
                                            <LogList />
                                        </Route>
                                    )}
                                    {this.props.uid && (
                                        <Route path='/procList'>
                                            <ProcedureList />
                                        </Route>
                                    )}
                                    {this.props.uid && (
                                        <Route path='/newCase'>
                                            <NewEntry />
                                        </Route>
                                    )}
                                    {this.props.uid && (
                                        <Route path='/newProc'>
                                            <NewProcedure />
                                        </Route>
                                    )}
                                    {this.props.uid && (
                                        <Route path='/edit'>
                                            <EditEntry />
                                        </Route>
                                    )}
                                    {this.props.uid && (
                                        <Route path='/profile'>
                                            <Profile />
                                        </Route>
                                    )}
                                    {this.props.uid && (
                                        <Route path='/editProfile'>
                                            <EditProfile />
                                        </Route>
                                    )}
                                    {this.props.uid && (
                                        <Route path='/report'>
                                            <Report />
                                        </Route>
                                    )}
                                    <Route path='/'>{this.props.uid ? <Redirect to='/list' /> : <Auth />}</Route>
                                </Switch>
                            )}
                            <Box mt={4}>
                                <Typography variant='body2' align='center'>
                                    &copy; 2020 David Olmstead
                                </Typography>
                            </Box>
                        </Route>
                    </Switch>
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

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(App));
