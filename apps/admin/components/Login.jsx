import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-class';
import $ from 'jquery';
import {Form, FormGroup, Col, InputGroup, FormControl, Button} from 'react-bootstrap';

import url from 'common/url';
import './Login.less';

// Login view.
class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    };
  }

  isValid() {
    let username = ReactDOM.findDOMNode(this.refs.username).value;
    let password = ReactDOM.findDOMNode(this.refs.password).value;

    return username && password;
  }

  onKeyPress(e) {
    if(e.key === 'Enter') {
      this.onLogin();
    }
  }

  // Handle the login event.
  onLogin() {
    let username = ReactDOM.findDOMNode(this.refs.username).value;
    let password = ReactDOM.findDOMNode(this.refs.password).value;

    if(!username) {
      this.setState({
        error: 'Please specify a Username'
      }, () => {
        ReactDOM.findDOMNode(this.refs.username).focus();
      });
    } else if(!password) {
      this.setState({
        error: 'Please specify a Password'
      }, () => {
        ReactDOM.findDOMNode(this.refs.password).focus();
      });
    } else {
      // Post the form.

      let data = JSON.stringify({username: username, password: password});
      $.ajax({
          type: 'POST',
          url: url('scripts/login.php'),
          data: data,
          dataType: 'json',
          contentType: 'application/json'
        }).done(() => {
          // Successfully logged in, change view.
          this.props.onLogin();
        }).fail(response => {
          // Login failed.
          this.setState({
            error: 'Invalid Username/Password'
          }, () => {
            ReactDOM.findDOMNode(this.refs.username).select();
          });
        });
    }

  }

  render() {
    return (
      <div className='savvy-login'>
        <img src='assets/images/home/logo.jpg' />
        <Form className='form'>
          <div className='error'>{this.state.error}</div>
          <FormGroup controlId="username">
            <InputGroup>
              <InputGroup.Addon><span className='fa fa-user' /></InputGroup.Addon>
              <FormControl type='text' ref='username' placeholder='Username' onKeyPress={this.onKeyPress} />
            </InputGroup>
          </FormGroup>
          <FormGroup controlId="password">
            <InputGroup>
              <InputGroup.Addon><span className='fa fa-lock' /></InputGroup.Addon>
              <FormControl type='password' ref='password' placeholder='Password' onKeyPress={this.onKeyPress} />
            </InputGroup>
          </FormGroup>
          <FormGroup controlId="login">
            <Button className="btn btn-cta btn-cta-primary" onClick={this.onLogin}>Login</Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

Login.PropTypes = {
  onLogin: React.PropTypes.func
};

export default Login;