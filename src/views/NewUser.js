import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import { withRouter, Link } from 'react-router-dom';

import { Form, Message, Container, Button, Card } from 'semantic-ui-react';

import './NewUser.css';

class NewUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            pass: '',
            confPass: '',
            loading: false,
            error: false,
            errorMessage: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    async handleSubmit(event) {
        console.log('Submitted.');

        if (this.state.pass === this.state.confPass) {
            this.setState({
                loading: true,
            });

            firebase
                .auth()
                .createUserWithEmailAndPassword(
                    this.state.email,
                    this.state.pass
                )
                .then((user) =>
                    user.updateProfile({
                        displayName: this.state.name,
                    })
                )
                .then(() => {
                    this.props.history.push('/list');
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        loading: false,
                        error: true,
                        errorMessage: error.message,
                    });
                });
        } else {
            this.setState({
                error: true,
                errorMessage: 'Passwords must match.',
            });
        }
    }

    render() {
        return (
            <Container>
                <Card fluid>
                    <Card.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Input
                                name='email'
                                value={this.state.email}
                                onChange={this.handleChange}
                                label='Email Address'
                                type='email'
                            />
                            <Form.Input
                                name='name'
                                value={this.state.name}
                                onChange={this.handleChange}
                                label='Name'
                                type='text'
                            />
                            <Form.Input
                                name='pass'
                                value={this.state.pass}
                                onChange={this.handleChange}
                                label='Password (min. 6 characters)'
                                type='password'
                            />
                            <Form.Input
                                name='confPass'
                                value={this.state.confPass}
                                onChange={this.handleChange}
                                label='Confirm Password'
                                type='password'
                            />
                            <Button
                                color='blue'
                                type='submit'
                                loading={this.state.loading}
                            >
                                Submit
                            </Button>
                            <Link to='/'>
                                <Button
                                    color='red'
                                    type='reset'
                                    onClick={this.handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Link>
                            {this.state.error && (
                                <Message negative>
                                    {this.state.errorMessage}
                                </Message>
                            )}
                            <Message>
                                Your first and last name are needed to generate
                                a PDF report of your logbook.
                            </Message>
                        </Form>
                    </Card.Content>
                </Card>
            </Container>
        );
    }
}

const HOCNewUser = withRouter(NewUser);

export default HOCNewUser;
