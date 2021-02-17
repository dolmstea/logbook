import React from 'react';

import { Card, CardContent, Typography, CircularProgress, Box, Grid } from '@material-ui/core';

class Loading extends React.Component {
    render() {
        return (
            <Box mt={2}>
                <Grid container justify='center'>
                    <Grid item xs={10} sm={4}>
                        <Card variant='outlined'>
                            <CardContent>
                                <Box mt={6} display='flex' justifyContent='center'>
                                    <Typography variant='h5'>Loading</Typography>
                                </Box>
                                <Box my={6} display='flex' justifyContent='center'>
                                    <CircularProgress />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Loading;
