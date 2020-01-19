import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import Component from 'react-class';

import url from 'common/url';
import './DeleteDialog.less';

class DeleteStudentDialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      deleting: false
    }
  }

  deleteDone() {
    this.setState({
      deleting: false
    }, this.props.onClose.bind(this));
  }

  onDelete() {
    this.setState({
      deleting: true
    }, this.deleteStudent);
  }

  deleteStudent() {
    let path = 'scripts/workshop.php';

    let data = {
      date: this.props.date,
      email: this.props.student.email,
      count: 1,
      remove: true
    };

    $.ajax({
      url: url(path),
      cache: false,
      dataType: 'text',
      contentType: 'application/json',
      data: JSON.stringify(data),
      type: 'POST'
    }).done(response => {
      console.log('Successful delete from Datatbase', response);
      this.deleteDone();
    }).fail(response => {
      console.error('Failed delete from database', response);
      alert('DB DELETE FAILED! Tell Keith!');
      this.deleteDone();
    });
  }

  render() {
    return (
      <Modal className='savvy-delete-dialog' show={this.props.show} onHide={this.props.onClose} backdrop='static'>
        {
          this.state.deleting ? (
            <div className='deleting'>
              <img src='assets/images/gears.svg' />
              <h3>Deleting...</h3>
            </div>) : undefined
        }
        <Modal.Header closeButton>
          <Modal.Title>Delete Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove student,
          &quot;<span className='title'>{this.props.student && this.props.student.name}</span>&quot;?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.onDelete}>Remove</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteStudentDialog.PropTypes = {
  show: React.PropTypes.bool,
  date: React.PropTypes.string.isRequired,
  student: React.PropTypes.object.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default DeleteStudentDialog;