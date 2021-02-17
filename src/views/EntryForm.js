import React from 'react';

import {
    Box,
    Typography,
    TextField,
    Select,
    Checkbox,
    FormControl,
    InputLabel,
    FormControlLabel,
    Grid,
    InputAdornment,
    Button,
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import { CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';

const locations = ['VGH', 'SPH', 'RCH', 'BCWH/BCCH', 'LGH', 'Victoria'];

const services = [
    'Gen Surg',
    'Gyne',
    'Obstetrics',
    'Neuro',
    'Cardiac',
    'Thoracic',
    'ENT',
    'Ortho',
    'Urology',
    'Ophtho',
];

const types = ['General', 'Spinal', 'Epidural', 'MAC', 'Regional Block', 'Local'];

const procedures = ['IV', 'Intubation', 'LMA', 'Spinal', 'Epidural', 'Art Line', 'Central Line', 'Nerve Block'];

const epas = ['A1', 'B2'];

class EntryForm extends React.Component {
    /*
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value,
        });
    }

    handleChangeAC(key, value) {
        this.setState({
            [key]: value,
        });
    }
    */

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
                <TextField
                    variant='outlined'
                    type='number'
                    name='age'
                    label='Age'
                    margin='normal'
                    fullWidth
                    value={this.props.data.age}
                    onChange={this.props.handleChange}
                />
                <Grid container direction='row' alignItems='center'>
                    <Grid item>
                        <FormControl variant='outlined' margin='normal'>
                            <InputLabel htmlFor='asaSelect'>ASA</InputLabel>
                            <Select
                                native
                                variant='outlined'
                                label='ASA'
                                inputProps={{
                                    name: 'asa',
                                    id: 'asaSelect',
                                }}
                                value={this.props.data.asa}
                                onChange={this.props.handleChange}
                            >
                                <option value={1}>I</option>
                                <option value={2}>II</option>
                                <option value={3}>III</option>
                                <option value={4}>IV</option>
                                <option value={5}>V</option>
                                <option value={6}>VI</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/*
                    <Grid item>
                        <Box ml={4} pt={1}>
                            <Button variant='outlined' size='large' startIcon={this.props.data.e ? <CheckBox /> : <CheckBoxOutlineBlank />}>
                                E
                            </Button>
                        </Box>
                    </Grid>
                    */}
                    <Grid item>
                        <Box ml={4} pt={1}>
                            <FormControlLabel
                                name='e'
                                control={<Checkbox checked={this.props.data.e} onChange={this.props.handleChange} />}
                                label='E'
                                labelPlacement='end'
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Autocomplete
                    name='service'
                    freeSolo
                    options={services}
                    value={this.props.data.service}
                    onChange={(event, value, reason) => this.props.handleChangeAC('service', value)}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Surgical Service' />
                    )}
                />
                <Autocomplete
                    name='type'
                    freeSolo
                    multiple
                    options={types}
                    value={this.props.data.type}
                    onChange={(event, value, reason) => this.props.handleChangeAC('type', value)}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Anesthetic Type' />
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
                <Autocomplete
                    freeSolo
                    multiple
                    options={epas}
                    value={this.props.data.epas}
                    onChange={(event, value, reason) => this.props.handleChangeAC('epas', value)}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='EPA-Specific' />
                    )}
                />
                <TextField
                    variant='outlined'
                    name='case'
                    value={this.props.data.case}
                    onChange={this.props.handleChange}
                    label='Case Description'
                    margin='normal'
                    fullWidth
                />
                <TextField
                    variant='outlined'
                    name='staff'
                    value={this.props.data.staff}
                    onChange={this.props.handleChange}
                    label='Staff'
                    margin='normal'
                    fullWidth
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
                {/*
                <Box display='flex' justifyContent='center' pt={2}>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.props.handleSubmit(this.state);
                                this.props.history.push('/list');
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.props.handleSubmit(this.state);
                                this.setState({
                                    date: '',
                                    location: '',
                                    age: '',
                                    asa: '',
                                    e: false,
                                    service: '',
                                    type: [],
                                    procedures: [],
                                    epas: [],
                                    case: '',
                                    staff: '',
                                    comments: '',
                                });
                            }}
                        >
                            Save &amp; New
                        </Button>
                    </Box>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.props.history.push('/list');
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
                        */}
            </React.Fragment>
        );
    }
}

export default EntryForm;
