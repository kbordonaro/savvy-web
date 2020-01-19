import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-class';
import $ from 'jquery';
import {Form, FormGroup, ControlLabel, FormControl, Col, HelpBlock} from 'react-bootstrap';

import url from 'common/url';
import './AddStudentForm.less';

// Add/Edit collection item dialog.
class AddStudentForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      student: {},
      remaining: (props.workshop.total - props.workshop.registered),
      errors: new Map()
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      student: {},
      remaining: (props.workshop.total - props.workshop.registered),
      errors: new Map()
    });
  }

  getData() {
    return {
      name: this.nameInput.value.trim(),
      phone: this.phoneInput.value.trim(),
      email: this.emailInput.value.trim(),
      count: this.countInput.value.trim(),
      date: this.props.date
    };
  }

  onValidate() {
    if(this.state.errors.size > 0) {
      let data = this.getData();
      let errors = this.validate(data);

      this.setState({
        student: data,
        errors: errors
      });
    }
  }

  saveData(data) {
    let path = 'scripts/workshop.php';

    $.ajax({
      url: url(path),
      cache: false,
      dataType: 'text',
      contentType: 'application/json',
      data: JSON.stringify(data),
      type: 'POST'
    }).done(id => {
      console.log('Successful Updated Datatbase', id);
      this.props.onSaved();
    }).fail(response => {
      console.error('Failed update database', response);
      alert('DB INSERT FAILED! Tell Keith!');
    });
  }

  onSave() {
    let data = this.getData();
    let errors = this.validate(data);

    if(errors.size > 0) {
      console.error("Error", errors, data);

      this.setState({
        student: data,
        errors: errors
      });
    } else {
      this.saveData(data);
    }
  }

  validate(data) {
    let errors = new Map();

    if(data.name.length === 0) {
      errors.set('name', 'Name is required.');
    }

    if(data.email.length === 0) {
      errors.set('email', 'Email is required.');
    }

    if(data.email.indexOf(',') >= 0) {
      errors.set('email', 'Email is invalid (can\'t have a comma)');
    }

    if(data.email.length > 255) {
      errors.set('email', 'Email address is too long.');
    }

    return errors;
  }

  render() {
    let student = this.state.student;

    let options = [];
    for(let i=1; i<=this.state.remaining; i++) {
      options.push(
        <option key={i} value={i}>{i}</option>
      );
    }

    return (
      <Form horizontal>
        <FormGroup validationState={this.state.errors.has('name') ? 'error' : undefined}>
          <Col componentClass={ControlLabel} xs={3}>Name</Col>
          <Col xs={9}>
            <FormControl id='nameField' type='text' inputRef={
              ref => {
                this.nameInput = ref;
                if(ref) {
                  ref.onchange = this.onValidate;
                  ref.onkeypress = this.onValidate;
                  if(student.name) {
                    ref.value = student.name;
                  }
                }
              }
            } />
            <FormControl.Feedback />
            <HelpBlock>{this.state.errors.get('name')}</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup validationState={this.state.errors.has('name') ? 'error' : undefined}>
          <Col componentClass={ControlLabel} xs={3}>Email</Col>
          <Col xs={9}>
            <FormControl id='emailField' type='text' inputRef={
              ref => {
                this.emailInput = ref;
                if(ref) {
                  ref.onchange = this.onValidate;
                  ref.onkeypress = this.onValidate;
                  if(student.email) {
                    ref.value = student.email;
                  }
                }
              }
            } />
            <FormControl.Feedback />
            <HelpBlock>{this.state.errors.get('email')}</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} xs={3}>Phone</Col>
          <Col xs={9}>
            <FormControl id='phoneField' type='text' inputRef={
              ref => {
                this.phoneInput = ref;
                if(ref && student.phone) {
                  ref.value = student.phone;
                }
              }
            } />
            <FormControl.Feedback />
            <HelpBlock>{this.state.errors.get('phone')}</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} xs={3}>Seats</Col>
          <Col xs={3}>
            <FormControl componentClass="select" ref="count" placeholder={this.state.count} inputRef={
              ref => {
                this.countInput = ref;
              }
            } >
              {options}
            </FormControl>
            <FormControl.Feedback />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

AddStudentForm.PropTypes = {
  workshop: React.PropTypes.object,
  date: React.PropTypes.string.isRequired,
  onSaved: React.PropTypes.func.isRequired
};

export default AddStudentForm;
