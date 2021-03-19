import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import { Container, TextField, Typography, Box, Button } from '@material-ui/core';

import { styled } from '@material-ui/core/styles';

import { Alert } from '@material-ui/lab';

import { Link } from 'react-router-dom';

const CButton = styled(Button)({
    textAlign: 'center'
});

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
            error: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value,
        });
    }

    handleSignIn(event) {
        event.preventDefault();
        console.log('handleSignIn();');
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.pass)
            .then((user) => {
                console.log('Success!');
            })
            .catch((error) => {
                console.log(error.message);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <Container maxWidth='sm'>
                <form onSubmit={this.handleSignIn}>
                    <Box mt={8}>
                        <Typography variant='h4'>Sign In</Typography>
                    </Box>
                    <TextField
                        name='email'
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        variant='outlined'
                        type='email'
                        label='Email'
                        margin='normal'
                        fullWidth
                    />
                    <TextField
                        name='pass'
                        value={this.state.pass}
                        onChange={this.handleInputChange}
                        variant='outlined'
                        type='password'
                        label='Password'
                        margin='normal'
                        fullWidth
                    />
                    {this.state.error && <Alert severity='error'>Problem logging in.</Alert>}
                    <Box display='flex' justifyContent='center' pt={2}>
                        <Box mx={1}>
                            <Button variant='outlined' type='submit'>
                                Sign In
                            </Button>
                        </Box>
                        <Box mx={1}>
                            <Link to='/resetPass' component={CButton} variant='outlined'>
                                Forgot Password
                            </Link>
                        </Box>
                        <Box mx={1}>
                            <Link to='/addUser' component={CButton} variant='outlined'>
                                Sign Up
                            </Link>
                        </Box>
                    </Box>
                </form>
            </Container>
        );
    }
}

export default Auth;
