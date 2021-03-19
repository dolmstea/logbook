import React from 'react';

import {
    Container,
    Box,
    Button,
} from '@material-ui/core';

import { connect } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { withRouter } from 'react-router-dom';

import EntryForm from '../components/EntryForm.js';

class EditEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = props.location.state;

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAC = this.handleChangeAC.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    async handleSubmit() {
        var db = firebase.firestore();

        var data = this.state;

        await db
            .collection(this.props.uid)
            .doc(this.state.id)
            .update(data)
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <Container maxWidth='sm'>
                <EntryForm
                    title='Edit Entry'
                    data={this.state}
                    handleChange={this.handleChange}
                    handleChangeAC={this.handleChangeAC}
                />
                <Box display='flex' justifyContent='center' pt={2}>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.handleSubmit();
                                this.props.history.push('/list');
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.props.history.goBack();
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Container>
        );

        {
            /*
        return (
            <Container maxWidth='sm'>
                <Box mt={8}>
                    <Typography variant='h4'>Edit Entry</Typography>
                </Box>
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
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.handleSubmit();
                                this.props.history.push('/list');
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.props.history.goBack();
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
                        */
        }
    }
}

const mapStateToProps = (state) => ({
    uid: state,
});

const HOCEditEntry = withRouter(EditEntry);

export default connect(mapStateToProps, null)(HOCEditEntry);
