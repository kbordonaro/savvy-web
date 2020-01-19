import React from 'react';
import Component from 'react-class';
import {Grid, Row, Col, Modal} from 'react-bootstrap';
import $ from 'jquery';
import 'jquery-match-height';

import Item from './Item';
import Tags from './Tags';
import url from 'common/url';
import {getPageId, pageTitle, pageText} from 'common/tags';
import './Collection.less';

// View of the collection.
class Collection extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      tags: props.tags,
      enlarge: props.enlarge
    };
  }

  onEnlarge(item) {
    this.setState({
      enlarge: item
    });
  }

  onCloseEnlarge() {
    this.setState({
      enlarge: undefined
    });
  }

  componentWillMount() {
    this.getCollection();
  }

  componentWillReceiveProps(props) {
    let enlarge;
    if(props.enlarge && this.state.collection) {
      this.state.collection.some(item => {
        if(props.enlarge.id === item.id) {
          enlarge = item;
          return true;
        }
      });
    }

    this.setState({
      tags: props.tags,
      enlarge: enlarge
    });
  }

  onLoad() {
    if(this.match) {
      clearTimeout(this.match);
    }

    this.match = setTimeout(() => {
      $('.savvy-item').matchHeight();
      this.match = undefined;
    }, 100);
  }

  onTags(tags) {
    this.setState({
      tags: tags
    }, this.onLoad.bind(this));
  }

  getCollection() {
    $.ajax({
      method: 'GET',
      url: url('scripts/api.php/collection/')
    }).done((collection) => {
      collection = JSON.parse(collection).map(item => {
        item.sold = item.sold && Boolean(item.sold !== '0');
        return item;
      });

      collection.sort((a, b) => {
        if(a.sold && !b.sold) {
          return 1;
        } else if(!a.sold && b.sold) {
          return -1;
        } else {
          return b.id - a.id;
        }
      });

      let enlarge;
      if(this.state.enlarge) {
        collection.some(item => {
          if(this.state.enlarge.id === item.id) {
            enlarge = item;
            return true;
          }
        });
      }

      this.setState({
        collection: collection,
        enlarge: enlarge
      });
    }).fail(response => {
      this.setState({
        error: response
      });
    });
  }

  render() {
    let view;

    let id = getPageId(this.state.tags);
    let title = pageTitle(id);
    let text = pageText(id);

    let filteredCollection = [];
    if(this.state.collection && this.state.tags) {
      this.state.collection.forEach(item => {
        let itemTags = {};
        item.tags.split(',').forEach(tag => {
          itemTags[tag] = true;
        });

        let filter = this.state.tags.some(tag => !itemTags[tag]);

        if(!filter) {
          filteredCollection.push(item);
        }
      });
    } else {
      filteredCollection = this.state.collection;
    }

    if(this.state.error) {
      view = (<div>
        <h1>Error Occured</h1>
        <h4>{this.state.error.status} - {this.state.error.statusText}</h4>
      </div>);
    } else if(filteredCollection) {
      view = (
        <Grid>
          <Row>
            {
              filteredCollection.map((item) => {
                return (
                  <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                    <Item small={true} item={item} onLoad={this.onLoad} onEnlarge={this.onEnlarge} {...this.props} />
                  </Col>
                );
              })
            }
          </Row>
        </Grid>
      );
    }

    let modalItem = this.state.enlarge ? (
      <Item small={false} item={this.state.enlarge} {...this.props} />
    ) : undefined;

    return (
      <div className='savvy-collection'>
        <div className='container savvy-header'>
          <h1>{title}</h1>
          {text}
        </div>
        <div className="tags">
          <Tags tags={this.state.tags} onChange={this.onTags} />
        </div>
        {view}
        <Modal className='savvy-collection-enlarge' show={Boolean(this.state.enlarge)} onHide={this.onCloseEnlarge}>
          <Modal.Header closeButton />
          <Modal.Body>
            {modalItem}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

Collection.PropTypes = {
  onEdit: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  tags: React.PropTypes.array
};

export default Collection;