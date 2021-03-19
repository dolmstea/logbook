import React from 'react';

import {
    Box,
    Typography,
    TextField,
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

const locations = ['VGH', 'SPH', 'RCH', 'BCWH/BCCH', 'LGH', 'Victoria'];

const procedures = ['IV', 'Intubation', 'LMA', 'Spinal', 'Epidural', 'Art Line', 'Central Line', 'Nerve Block'];

class ProcedureForm extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Box mt={8}>
                    <Typography variant='h4'>{this.props.title}</Typography>
                </Box>
                <TextField
                    variant='outlined'
                    type='date'
                    name='date'
                    margin='normal'
                    fullWidth
                    value={this.props.data.date}
                    onChange={this.props.handleChange}
                />
                <Autocomplete
                    name='location'
                    freeSolo
                    options={locations}
                    value={this.props.data.location}
                    onChange={(event, value, reason) => this.props.handleChangeAC('location', value)}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Location' />
                    )}
                />
                <Autocomplete
                    freeSolo
                    multiple
                    options={procedures}
                    value={this.props.data.procedures}
                    onChange={(event, value, reason) => this.props.handleChangeAC('procedures', value)}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Procedures' />
                    )}
                />
                <TextField
                    variant='outlined'
                    name='comments'
                    value={this.props.data.comments}
                    onChange={this.props.handleChange}
                    label='Comments'
                    margin='normal'
                    fullWidth
                    multiline
                />
            </React.Fragment>
        );
    }
}

export default ProcedureForm;
