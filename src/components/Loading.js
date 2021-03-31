import React from 'react';

import { Card, CardContent, Typography, CircularProgress, LinearProgress, Box, Grid } from '@material-ui/core';

export default function Loading(props) {
    return (
        <Box mt={2}>
            <Grid container justify='center'>
                <Grid item xs={10} sm={4}>
                    <Card variant='outlined'>
                        <CardContent>
                            <Box my={6} display='flex' justifyContent='center'>
                                <Typography variant='h5'>Loading</Typography>
                            </Box>
                            <Box my={6}>
                                {props.progress ? (
                                    <LinearProgress variant='determinate' value={props.progress} />
                                ) : (
                                    <LinearProgress />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
