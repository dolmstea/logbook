import React from 'react';

import { Container, Typography, Box } from '@material-ui/core';

class Profile extends React.Component {
    render() {
        return (
            <Container maxWidth='sm'>
                <Box my={8}>
                    <Typography variant='h4'>Profile</Typography>
                </Box>
                <Typography variant='h6'>Email: </Typography>
                <Typography variant='h6'>Name: </Typography>
            </Container>
        );
    }
}

export default Profile;