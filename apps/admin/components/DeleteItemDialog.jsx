import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import Component from 'react-class';

import url from 'common/url';
import './DeleteDialog.less';

class DeleteItemDialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      deleting: false
    }
  }

  deleteDone(refresh) {
    this.setState({
      deleting: false
    }, this.props.onClose.bind(this, refresh));
  }

  onDelete() {
    this.setState({
      deleting: true
    }, this.deleteItem);
  }

  deleteItem() {
    let path = 'scripts/api.php/collection/' + this.props.item.id;

    $.ajax({
      url: url(path),
      type: 'DELETE'
    }).done(response => {
      console.log('Successful delete from Datatbase', response);
      this.deleteDone(true);
    }).fail(response => {
      console.error('Failed delete from database', response);
      alert('DB DELETE FAILED! Tell Keith!');
      this.deleteDone(false);
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
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete item,
          &quot;<span className='title'>{this.props.item && this.props.item.title}</span>&quot;?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.onDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteItemDialog.PropTypes = {
  show: React.PropTypes.bool,
  item: React.PropTypes.object.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default DeleteItemDialog;