import React from 'react';

import { connect } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { withRouter } from 'react-router-dom';

import {
    Container,
    Box,
    Typography,
    TextField,
    Select,
    Checkbox,
    FormControl,
    InputLabel,
    FormControlLabel,
    FormGroup,
    TextareaAutosize,
    Button,
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import { DatePicker } from '@material-ui/pickers';

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

class NewEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event, optName, optVal) {
        if (optName && optVal) {
            this.setState({
                [optName]: optVal,
            });
        } else {
            const target = event.target;
            const name = target.name;
            const value = target.type === 'checkbox' ? target.checked : target.value;

            this.setState({
                [name]: value,
            });
        }
    }

    async handleSubmit(event) {
        var db = firebase.firestore();

        const docRef = await db.collection(this.props.uid).add(this.state);

        this.props.history.push('/list');
    }

    render() {
        return (
            <Container maxWidth='sm'>
                <Box mt={8}>
                    <Typography variant='h4'>New Entry</Typography>
                </Box>
                {/*
                <DatePicker
                    label='Date'
                    inputVariant='outlined'
                    />
        */}
                <TextField
                    variant='outlined'
                    type='date'
                    name='date'
                    margin='normal'
                    fullWidth
                    value={this.state.date}
                    onChange={this.handleChange}
                />
                <Autocomplete
                    name='location'
                    freeSolo
                    options={locations}
                    value={this.state.location}
                    onChange={(event, value, reason) => {
                        this.handleChange(event, 'location', value);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Location' />
                    )}
                />
                <TextField
                    variant='outlined'
                    name='age'
                    label='Age'
                    margin='normal'
                    fullWidth
                    value={this.state.age}
                    onChange={this.handleChange}
                />
                <FormGroup row>
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
                            value={this.state.asa}
                            onChange={this.handleChange}
                        >
                            <option value={1}>I</option>
                            <option value={2}>II</option>
                            <option value={3}>III</option>
                            <option value={4}>IV</option>
                            <option value={5}>V</option>
                            <option value={6}>VI</option>
                        </Select>
                    </FormControl>
                    <Box ml={4}>
                        <FormControlLabel
                            value='asaE'
                            control={<Checkbox checked={this.state.e} onChange={this.handleChange} />}
                            label='E'
                            labelPlacement='end'
                        />
                    </Box>
                </FormGroup>
                <Autocomplete
                    freeSolo
                    options={services}
                    value={this.state.service}
                    onChange={(event, value, reason) => {
                        this.handleChange(event, 'service', value);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Surgical Service' />
                    )}
                />
                <Autocomplete
                    freeSolo
                    multiple
                    options={types}
                    value={this.state.type}
                    onChange={(event, value, reason) => {
                        this.handleChange(event, 'type', value);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Anesthetic Type' />
                    )}
                />
                <Autocomplete
                    freeSolo
                    multiple
                    options={procedures}
                    value={this.state.procedures}
                    onChange={(event, value, reason) => {
                        this.handleChange(event, 'procedures', value);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='Procedures' />
                    )}
                />
                <Autocomplete
                    freeSolo
                    multiple
                    options={epas}
                    value={this.state.epas}
                    onChange={(event, value, reason) => {
                        this.handleChange(event, 'epas', value);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} margin='normal' variant='outlined' label='EPA-Specific' />
                    )}
                />
                <TextField
                    variant='outlined'
                    name='case'
                    value={this.state.case}
                    onChange={this.handleChange}
                    label='Case Description'
                    margin='normal'
                    fullWidth
                />
                <TextField
                    variant='outlined'
                    name='staff'
                    value={this.state.staff}
                    onChange={this.handleChange}
                    label='Staff'
                    margin='normal'
                    fullWidth
                />
                <TextField
                    variant='outlined'
                    name='comments'
                    value={this.state.comments}
                    onChange={this.handleChange}
                    label='Comments'
                    margin='normal'
                    fullWidth
                    multiline
                />
                <Box display='flex' justifyContent='center' pt={2}>
                    <Box mx={1}>
                        <Button variant='outlined' onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </Box>
                    <Box mx={1}>
                        <Button variant='outlined'>Cancel</Button>
                    </Box>
                </Box>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    uid: state,
});

const HOCNewEntry = withRouter(NewEntry);

export default connect(mapStateToProps, null)(HOCNewEntry);
