import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-class';
import Select from 'react-select';
import $ from 'jquery';
import {Modal, Button, Form, FormGroup, ControlLabel, FormControl, Checkbox, Col, HelpBlock} from 'react-bootstrap';
import 'react-select/dist/react-select.css';

import url from 'common/url';
import {options} from 'common/tags';
import './CollectionDialog.less';

// Add/Edit collection item dialog.
class CollectionDialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      item: this.props.item || {},
      errors: new Map()
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      item: props.item || {},
      errors: new Map(),
      isEdit: Boolean(props.item && props.item.id)
    });
  }

  getData() {
    return {
      title: this.titleInput.value.trim(),
      description: this.descriptionInput.value.trim(),
      tags: this.state.item.tags,
      price: this.priceInput.value && parseFloat(this.priceInput.value.trim()).toFixed(2),
      sold: Boolean(this.soldInput.checked),
      width: this.widthInput.value.trim(),
      height: this.heightInput.value.trim(),
      depth: this.depthInput.value.trim()
    };
  }

  getImage() {
    return this.imageInput.files[0];
  }

  onValidate() {
    if(this.state.errors.size > 0) {
      let data = this.getData();
      let image = this.getImage();
      let errors = this.validate(data, image);

      this.setState({
        item: data,
        errors: errors
      });
    }
  }

  finishUpload(refresh) {
    this.setState({
      uploading: false
    }, this.props.onClose.bind(this, refresh));
  }

  onSold() {
    this.setState({
      item: this.getData()
    });
  }

  uploadImage(id, data, image) {
    if(image) {
      let formData = new FormData();
      formData.append('file', image);
      $.ajax({
        url: url('scripts/collection.php/' + id),
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'POST'
      }).done((response) => {
        // Upload was successful, close dialog and refresh.
        console.log('Successful Upload');
        this.finishUpload(true);
      }).fail(response => {
        console.error('Failed upload image', response);
        alert('UPLOAD FAILED! Tell Keith!');
        this.finishUpload(false);
      });
    } else {
      this.finishUpload(true);
    }
  }

  saveData(data, image) {
    let path = 'scripts/api.php/collection' +
      (this.state.isEdit ? ('/' + this.props.item.id) : '');

    $.ajax({
      url: url(path),
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      type: 'POST'
    }).done(id => {
      console.log('Successful Updated Datatbase', id);
      this.uploadImage(id, data, image);
    }).fail(response => {
      console.error('Failed update database', response);
      alert('DB INSERT FAILED! Tell Keith!');
      this.finishUpload(false);
    });
  }

  onTag(value) {
    let data = Object.assign(this.state.item);
    data.tags = value.map(item => item.value).join(',');

    this.setState({ item: data }, () => {
      this.onValidate();
    });
  }

  onSave() {
    let data = this.getData();
    let image = this.getImage();
    let errors = this.validate(data, image);

    if(errors.size > 0) {
      console.error("Error", errors, data);

      this.setState({
        item: data,
        errors: errors
      });
    } else {
      this.setState({
        uploading: true
      }, () => {
        this.saveData(data, image);
      });
    }
  }

  validate(data, image) {
    let errors = new Map();

    if(data.title.length === 0) {
      errors.set('title', 'Title is required.');
    }

    if(!this.state.isEdit && !image) {
      errors.set('image', 'Image is required.');
    }

    if(!this.state.item.tags || this.state.item.tags.length === 0) {
      errors.set('tags', 'Must have at least one tag.');
    }

    if(isNaN(data.price)) {
      errors.set('price', 'Not a valid price');
    }

    return errors;
  }

  render() {
    let item = this.state.item;

    return (
      <Modal className='savvy-collection-dialog' show={this.props.show} onHide={this.props.onClose} backdrop='static'>
        {
          this.state.uploading ? (
            <div className='uploading'>
              <img src='assets/images/gears.svg' />
              <h3>Uploading...</h3>
            </div>) : undefined
        }
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup validationState={this.state.errors.has('title') ? 'error' : undefined}>
              <Col componentClass={ControlLabel} xs={3}>Title</Col>
              <Col xs={9}>
                <FormControl id='titleField' type='text' inputRef={
                  ref => {
                    this.titleInput = ref;
                    if(ref) {
                      ref.onchange = this.onValidate;
                      ref.onkeypress = this.onValidate;
                      if(item.title) {
                        ref.value = item.title;
                      }
                    }
                  }
                } />
                <FormControl.Feedback />
                <HelpBlock>{this.state.errors.get('title')}</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup validationState={this.state.errors.has('image') ? 'error' : undefined}>
              <Col componentClass={ControlLabel} xs={3}>Image</Col>
              <Col xs={9}>
                <FormControl id='imageField' type='file' inputRef={
                  ref => {
                    this.imageInput = ref;
                    if(ref) {
                      ref.accept = 'image/jpeg';
                      ref.onchange = this.onValidate;
                    }
                  }
                } />
                <FormControl.Feedback />
                <HelpBlock>{this.state.errors.get('image')}</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup validationState={this.state.errors.has('tags') ? 'error' : undefined}>
              <Col componentClass={ControlLabel} xs={3}>Tags</Col>
              <Col xs={9}>
                <Select name='tags' multi={true} options={options} value={this.state.item.tags} onChange={this.onTag} />
                <HelpBlock>{this.state.errors.get('tags')}</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} xs={3}>Description</Col>
              <Col xs={9}>
                <FormControl id='descriptionField' type='text' inputRef={
                  ref => {
                    this.descriptionInput = ref;
                    if(ref && item.description) {
                      ref.value = item.description;
                    }
                  }
                } />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup validationState={this.state.errors.has('price') ? 'error' : undefined}>
              <Col componentClass={ControlLabel} xs={3}>Price $</Col>
              <Col xs={3}>
                <FormControl id='priceField' type='text' placeholder='100.00' inputRef={
                  ref => {
                    this.priceInput = ref;
                    if(ref) {
                      ref.onchange = this.onValidate;
                      ref.onkeypress = this.onValidate;
                      if(item.price) {
                        ref.value = item.price;
                        ref.disabled = item.sold;
                      }
                    }
                  }
                } />
                <FormControl.Feedback />
                <HelpBlock>{this.state.errors.get('price')}</HelpBlock>
              </Col>
              <Col xs={3}>
                <Checkbox id='soldCheckbox' inputRef={
                  ref => {
                    this.soldInput = ref;
                    if(ref) {
                      ref.onchange = this.onSold;
                      if(item.sold) {
                        ref.checked = item.sold;
                      }
                    }
                  }
                }>Sold</Checkbox>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} xs={3}>WxHxD</Col>
              <Col xs={3}>
                <FormControl id='widthField' type='text' placeholder='12"' inputRef={
                  ref => {
                    this.widthInput = ref;
                    if(ref && item.width) {
                      ref.value = item.width;
                    }
                  }
                } />
                <FormControl.Feedback />
              </Col>
              <Col xs={3}>
                <FormControl id='heightField' type='text' placeholder='12"' inputRef={
                  ref => {
                    this.heightInput = ref;
                    if(ref && item.height) {
                      ref.value = item.height;
                    }
                  }
                } />
                <FormControl.Feedback />
              </Col>
              <Col xs={3}>
                <FormControl id='depthField' type='text' placeholder='12"' inputRef={
                  ref => {
                    this.depthInput = ref;
                    if(ref && item.depth) {
                      ref.value = item.depth;
                    }
                  }
                } />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.onSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CollectionDialog.PropTypes = {
  show: React.PropTypes.bool,
  item: React.PropTypes.object,
  title: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default CollectionDialog;
