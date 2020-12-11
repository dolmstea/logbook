import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import { withRouter } from 'react-router-dom';

import {
    Container,
    Box,
    TextField,
    Typography,
    Button
} from '@material-ui/core';

class PassReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const val = target.value;

        this.setState({
            email: val
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
            console.log('Sent password reset email.');
            this.props.history.push('/');
        }).catch(() => {
            console.log('Error sending password reset email.');
        });
    }

    render() {
        return (
            <Container maxWidth='sm'>
                <form onSubmit={this.handleSubmit}>
                <Box mt={8}><Typography variant='h4'>Reset Password</Typography></Box>
                <TextField name='email' value={this.state.email} onChange={this.handleChange} variant='outlined' type='email' label='Email' margin='normal' fullWidth />
                <Typography variant='p'>Enter your email address to reset your password.</Typography>
                <Box display='flex' justifyContent='center' pt={2}>
                    <Box mx={1}><Button variant='outlined' type='submit'>Reset Password</Button></Box>
                </Box>
                </form>
            </Container>
        );
    }
}

const HOCPassReset = withRouter(PassReset);

export default HOCPassReset;