import React from 'react';
import Component from 'react-class';
import {Panel, Button, ButtonToolbar} from 'react-bootstrap';
import {ShareButtons, ShareCounts, generateShareIcon} from 'react-share';

import url from 'common/url';
import './Item.less';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  PinterestShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const PinterestIcon = generateShareIcon('pinterest');

// View a collection item
class Item extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    };
  }

  onLoad() {
    if(this.props.onLoad) {
      this.props.onLoad();
    }
  }

  onEnlarge() {
    if(this.props.small && this.props.onEnlarge) {
      this.props.onEnlarge(this.props.item);
    }
  }

  render() {
    let imgSrc = 'assets/images/collection/' + this.props.item.id + '.jpg';
    let imgUrl = url(imgSrc);
    let absImg = url(imgSrc, true);
    let itemUrl = url('collection.html#', true) + this.props.item.id;

    let iconSize = this.props.small ? 32 : 40;

    const preventClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    let buttons;
    if(this.props.onEdit && this.props.onDelete) {
      buttons = (
        <div className='buttons'>
          <Button bsStyle='success' className='left' onClick={this.props.onEdit.bind(this, this.props.item)}>
            <span className='fa fa-edit' />Edit
          </Button>
          <Button bsStyle='danger' className='right' onClick={this.props.onDelete.bind(this, this.props.item)}>
            <span className='fa fa-trash' />Delete
          </Button>
        </div>
      );
    } else {
      buttons = (
        <div className='buttons'>
          <span onClick={preventClick}>
            <FacebookShareButton picture={absImg} url={itemUrl} title={this.props.item.title} description={this.props.item.description}>
              <FacebookIcon size={iconSize} round={true} />
            </FacebookShareButton>
          </span>
          <span onClick={preventClick}>
            <TwitterShareButton url={itemUrl} title={this.props.item.title} hashtags={['SavvyCollection']}>
              <TwitterIcon size={iconSize} round={true} />
            </TwitterShareButton>
          </span>
          <span onClick={preventClick}>
            <GooglePlusShareButton url={itemUrl} title={this.props.item.title} description={this.props.item.description}>
              <GooglePlusIcon size={iconSize} round={true} />
            </GooglePlusShareButton>
          </span>
          <span onClick={preventClick}>
            <PinterestShareButton url={itemUrl} media={absImg} description={this.props.item.title + ' - ' + this.props.item.description}>
              <PinterestIcon size={iconSize} round={true} />
            </PinterestShareButton>
          </span>
        </div>
      );
    }

    let dim = [];
    if(this.props.item.width) {
      dim.push(this.props.item.width + 'W');
    }
    if(this.props.item.height) {
      dim.push(this.props.item.height + 'H');
    }
    if(this.props.item.depth) {
      dim.push(this.props.item.depth + 'D');
    }

    let dimensions = (dim.length > 0) ? ('Dimensions: ' + dim.join(' x ')) : undefined;

    // SALE: 20$ OFF
    // let price = (this.props.item.price && this.props.item.price > 0) ? ('$' + this.props.item.price) : undefined;
    // let salePrice = (this.props.item.price && this.props.item.price > 0) ? ('$' + this.props.item.price*0.8) : undefined;

    // let priceClass = this.props.item.sold ? 'price sold' : 'price';
    // let priceText = this.props.item.sold ? 'Sold' : price && (
    //   <span><span className='sale'>{price}</span> <span className="value discount">{salePrice}</span></span>
    // );

    let price = (this.props.item.price && this.props.item.price > 0) ? ('$' + this.props.item.price) : undefined;
 
    let priceClass = this.props.item.sold ? 'price sold' : 'price';
    let priceText = this.props.item.sold ? 'Sold' : price && (
      <span className='value'>{price}</span>
    );

    let info = this.props.small ? (
      <div>
        <h4>
          {this.props.item.title}
        </h4>
        <div className={priceClass}>{priceText}</div>
      </div>
    ) : (
      <div>
        <h3>{this.props.item.title} <span className={priceClass}>{priceText}</span></h3>
        <div>{this.props.item.description}</div>
        <div className='dimensions'>{dimensions}</div>
      </div>
    );

    return (
      <Panel className={'savvy-item ' + (this.props.small ? 'small' : 'large')} onClick={this.onEnlarge}>
        <div className='image'>
          <img src={imgUrl} onLoad={this.onLoad} />
        </div>
        {info}
        {buttons}
      </Panel>
    );
  }
}

Item.PropTypes = {
  item: React.PropTypes.object.isRequired,
  small: React.PropTypes.bool.isRequired,
  onEnlarge: React.PropTypes.func,
  onLoad: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onDelete: React.PropTypes.func
};

export default Item;