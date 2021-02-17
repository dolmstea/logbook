import React, { useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import { Container, TextField, Box, Typography, Card, Button } from '@material-ui/core';

import { useHistory } from 'react-router-dom';

export default function EditProfile() {
    var user = firebase.auth().currentUser;

    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.displayName);
    const history = useHistory();

    return (
        <Container maxWidth='sm'>
            <Box my={8}>
                <Typography variant='h4'>Profile</Typography>
            </Box>
            <Card variant='outlined'>
                <Box m={3}>
                    <TextField variant='outlined' name='email' label='Email' margin='normal' disabled fullWidth value={email} />
                    <TextField variant='outlined' name='name' label='Name' margin='normal' fullWidth value={name} onChange={(event) => {setName(event.target.value);}}/>
                </Box>
            </Card>
            <Box display='flex' justifyContent='center' pt={2}>
                <Box mx={1}>
                    <Button variant='outlined' onClick={() => {
                        user.updateProfile({
                            displayName: name
                        }).then(() => {
                            history.goBack();
                        }).catch(() => {
                            //Handle error.
                        });
                    }}>Update</Button>
                </Box>
                <Box mx={1}>
                    <Button variant='outlined' onClick={() => {
                        history.goBack();
                    }}>Cancel</Button>
                </Box>
            </Box>
        </Container>
    );
}
