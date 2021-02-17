import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import { Container, Typography, Box, Button, Card } from '@material-ui/core';

import { withRouter } from 'react-router-dom';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        var user = firebase.auth().currentUser;

        this.state = {
            user: user,
        };
    }

    render() {
        return (
            <Container maxWidth='sm'>
                <Box my={8}>
                    <Typography variant='h4'>Profile</Typography>
                </Box>
                <Card variant='outlined'>
                    <Box m={3}>
                        <Typography variant='h6'>Email: </Typography>
                        <Typography variant='body1'>{this.state.user.email}</Typography>
                        <Typography variant='h6'>Name: </Typography>
                        <Typography variant='body1'>{this.state.user.displayName}</Typography>
                    </Box>
                </Card>
                <Box display='flex' justifyContent='center' pt={2}>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.props.history.push('/editProfile');
                            }}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Box mx={1}>
                        <Button variant='outlined' onClick={() => {
                            this.props.history.goBack();
                        }}>Cancel</Button>
                    </Box>
                </Box>
            </Container>
        );
    }
}

const HOCProfile = withRouter(Profile);

export default HOCProfile;
