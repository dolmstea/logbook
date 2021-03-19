import React, { useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import { Container, TextField, Box, Typography, Button } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { useHistory } from 'react-router-dom';

export default function NewUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const history = useHistory();

    return (
        <Container maxWidth='sm'>
            <Box mt={8}>
                <Typography variant='h4'>New User</Typography>
            </Box>
            <TextField
                variant='outlined'
                name='name'
                label='Name'
                margin='normal'
                fullWidth
                value={name}
                onChange={(event) => {
                    setName(event.target.value);
                }}
            />
            <TextField
                variant='outlined'
                name='email'
                label='Email'
                margin='normal'
                fullWidth
                value={email}
                onChange={(event) => {
                    setEmail(event.target.value);
                }}
            />
            <TextField
                variant='outlined'
                name='pass'
                label='Password'
                type='password'
                margin='normal'
                fullWidth
                value={pass}
                onChange={(event) => {
                    setPass(event.target.value);
                }}
            />

            {error !== '' && <Alert severity='error'>{error}</Alert>}

            <Box display='flex' justifyContent='center' pt={2}>
                <Box mx={1}>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            firebase
                                .auth()
                                .createUserWithEmailAndPassword(email, pass)
                                .then((cred) => cred.user.updateProfile({ displayName: name }))
                                .then(() => {
                                    history.goBack();
                                    setError('');
                                })
                                .catch((e) => {
                                    setError(e.message);
                                });
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>
                <Box mx={1}>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            history.goBack();
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
