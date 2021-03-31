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

import { format, parse } from 'date-fns';

import EntryForm from '../components/EntryForm.js';

class EditEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            location: '',
            age: '',
            asa: '1',
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
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleChangeAC = this.handleChangeAC.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        var data = this.props.location.state;
        data.date = parse(data.date, 'y-MM-d', new Date());

        this.setState(data);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value,
        });
    }

    handleDateChange(date) {
        this.setState({
            date: date
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
        data.date = format(data.date, 'y-MM-dd');

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
                    handleDateChange={this.handleDateChange}
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
    }
}

const mapStateToProps = (state) => ({
    uid: state,
});

const HOCEditEntry = withRouter(EditEntry);

export default connect(mapStateToProps, null)(HOCEditEntry);
