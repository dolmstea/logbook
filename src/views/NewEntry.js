import React from 'react';

import {
    Container,
    Box,
    Button
} from '@material-ui/core';

import { connect } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { withRouter } from 'react-router-dom';

import EntryForm from './EntryForm.js';

class NewEntry extends React.Component {
    constructor(props) {
        super(props);

        var date = new Date();

        var dateString = date.toISOString().substring(0, 10);

        this.state = {
            date: dateString,
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

        data.dateAdded = Date.now();

        await db.collection(this.props.uid).add(data);
    }

    render() {
        return (
            <Container maxWidth='sm'>
                <EntryForm
                    title='New Entry'
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
                            Save
                        </Button>
                    </Box>
                    <Box mx={1}>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                this.handleSubmit();
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
                                this.props.history.goBack();
                            }}
                        >
                            Cancel
                        </Button>
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
