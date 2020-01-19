import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-class';
import moment from 'moment';
import $ from 'jquery';
import {Modal, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import 'react-select/dist/react-select.css';

import url from 'common/url';
import {DATE_FORMAT} from 'calendar/events/workshops.js';
import AddStudentForm from './AddStudentForm';
import DeleteStudentDialog from './DeleteStudentDialog';
import './WorkshopDialog.less';

const View = {
  LOADING: 0,
  STUDENTS: 1,
  ADD: 2
};

const StudentItem = ({student, onDelete}) => {
  return (
    <ListGroupItem header={student.name} bsStyle='info'>
      <span className='student-item'>
        <span className='contact'>
          <a href={'tel:' + student.phone}>{student.phone}</a>{student.phone && student.email ? ' | ' : ''}
          <a href={'mailto:' + student.email}>{student.email}</a>
        </span>
        <Button className='fa fa-times' onClick={onDelete.bind(undefined, student)}> Remove</Button>
      </span>
    </ListGroupItem>
  );
};

const OpenItem = ({onAdd, isPast}) => {
  return (
    <ListGroupItem bsStyle='success'>
      <Button bsStyle='success' disabled={isPast} className='fa fa-plus' onClick={onAdd}> Add Student</Button>
    </ListGroupItem>
  );
};

// Add/Remove workshop students dialog.
class WorkshopDialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      students: []
    };
  }

  getStudents() {
    $.ajax({
      method: 'GET',
      url: url('scripts/workshop.php?admin=1&date=' + encodeURIComponent(this.state.date))
    }).done((data) => {
      let workshop = data && JSON.parse(data);

      this.setState({
        view: View.STUDENTS,
        students: workshop.students || []
      });
    }).fail(response => {
      console.error('Failed upload image', response);
      alert('UPLOAD FAILED! Tell Keith!');
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      view: View.LOADING,
      date: props.workshop && moment(props.workshop.start).format(DATE_FORMAT),
      isPast: props.workshop && (props.workshop.start.getTime() < Date.now())
    }, () => {
      if(this.state.date) {
        this.getStudents();
      }
    });
  }

  onDelete(student) {
    this.setState({
      showDeleteDialog: true,
      student: student
    });
  }

  onCloseDialog() {
    this.setState({
      showDeleteDialog: false
    }, () => {
      this.getStudents();
    });
  }

  onAdd() {
    this.setState({
      view: View.ADD
    });
  }

  onCloseAdd() {
    this.setState({
      view: View.STUDENTS
    });
  }

  onSaveAdd() {
    this.refs.add.onSave();
  }

  onAddSaved() {
    this.getStudents();
  }

  render() {
    let workshop = this.props.workshop || {total: 0};

    let controls = <Button onClick={this.props.onClose}>Close</Button>;

    let view;
    switch(this.state.view) {
      case View.LOADING:
        view = <h2><span className='fa fa-spinner' /> Loading</h2>;
        break;

      case View.STUDENTS:
        let items = [];
        for(let i=0; i<workshop.total; i++) {
          let student = this.state.students[i];
          items.push(student ?
            <StudentItem key={i} student={student} onDelete={this.onDelete} /> :
            <OpenItem key={i} onAdd={this.onAdd} isPast={this.state.isPast} />
          );
        }

        view = (
          <ListGroup>
            {items}
          </ListGroup>
        );

        break;

      case View.ADD:
        view = (
          <AddStudentForm
            ref='add'
            onSaved={this.onAddSaved}
            workshop={this.props.workshop}
            date={this.state.date} />
        );

        controls = [
          <Button key='cancel' onClick={this.onCloseAdd}>Cancel</Button>,
          <Button key='add' bsStyle='primary' onClick={this.onSaveAdd}>Add</Button>          
        ]
    }

    return (
      <Modal className='savvy-workshop-dialog' show={this.props.show} onHide={this.props.onClose} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>{workshop.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {view}
        </Modal.Body>
        <Modal.Footer>
          {controls}
        </Modal.Footer>
        <DeleteStudentDialog
          show={this.state.showDeleteDialog}
          student={this.state.student}
          date={this.state.date}
          onClose={this.onCloseDialog} />
      </Modal>
    );
  }
}

WorkshopDialog.PropTypes = {
  show: React.PropTypes.bool,
  workshop: React.PropTypes.object,
  onClose: React.PropTypes.func.isRequired
};

export default WorkshopDialog;