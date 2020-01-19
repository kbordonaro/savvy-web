import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-class';
import {Form, FormGroup, Col, ControlLabel, FormControl, Button} from 'react-bootstrap';
import Ecwid from 'ecwid';

import moment from 'moment';

import './Workshop.less';
import {DATE_FORMAT} from 'calendar/events/workshops.js';

const TIME_FORMAT = 'h:mm A';

class Workshop extends Component {
  constructor(props, context) {
    super(props, context);

    let start = moment(props.workshop.start);
    let end = moment(props.workshop.end);

    this.state = {
      remaining: (props.workshop.total - props.workshop.registered),
      error: undefined,
      imgSrc: 'assets/images/workshops/' + props.workshop.type + '.jpg',
      selected: 1,
      date: start.format('dddd MMMM DD, YYYY'),
      time: {
        start: start.format(TIME_FORMAT),
        end: end.format(TIME_FORMAT)
      }
    };

    let isPast = (props.workshop.start.getTime() < Date.now());
    let isFull = (this.state.remaining <= 0);

    this.state.error = (isPast || isFull) ? (
      <div className="error">
        <div>
          {isPast ? 'Sorry, Registration has Closed!' : 'Sorry, this Workshop is Full!'}
        </div>
        <span onClick={props.onClose} className="btn btn-link fa fa-calendar"> Back to the Calendar</span>
      </div>
    ) : undefined;

    let setState = this.setState;
    Ecwid.OnAPILoaded.add(() => {
      Ecwid.Cart.get((cart) => {
        let product;
        cart.items.forEach((item, idx) => {
          if(moment(item.options.Date).isSame(props.workshop.start)) {
            product = {
              idx,
              item
            };
          }
        });

        if(product) {
          setState({
            remaining: this.state.remaining - product.item.quantity,
            inCart: product.item.quantity
          });
        }
      });
    });
  }

  onAdd() {
    let id;
    switch(this.props.workshop.type) {
      case 'byop':
        id = 81691060;
        break;
      case 'paint-101':
        id = 81691070;
        break;
      default:
        console.error("Workshop not supported: " + this.props.workshop.type);
        id = 81691060;
        break;
    }

    let product = {
      id,
      quantity: this.state.selected,
      options: {
        Date: moment(this.props.workshop.start).format(DATE_FORMAT)
      },
      callback: function(success, product, cart) {
        if(success) {
          location.hash = '!/~/cart';
        }
      }
    }

    Ecwid.Cart.addProduct(product);
  }

  onSelect() {
    this.setState({
      selected: ReactDOM.findDOMNode(this.refs.seats).value
    });
  }

  render() {
    let price = this.props.workshop.price;
    let options = [];
    for(let i=1; i<=this.state.remaining; i++) {
      options.push(<option key={'seats_' + i} value={i}>{i}</option>);
    }

    let inCart = this.state.inCart ? (
      <Col xs={12}>
        <div className='in-cart'>
          {this.state.inCart} Seat{this.state.inCart > 1 ? 's are' : ' is'} in your Cart!
        </div>
      </Col>
    ) : undefined;

    let selection = (this.state.remaining > 0) ? (
      <div>
        <Col componentClass={ControlLabel} xs={3}>Seats:</Col>
        <Col xs={9}>
          <FormControl componentClass="select" ref="seats" onChange={this.onSelect} placeholder={this.state.selected}>
            {options}
          </FormControl>
        </Col>
         <Col xs={12}>
          <Button className="fa fa-cart-plus btn btn-cta btn-cta-primary" onClick={this.onAdd}> ADD TO CART</Button>
        </Col>
        <Col xs={12}>
          <h4>Total: ${this.state.selected*price}</h4>
        </Col>
       {inCart}
      </div>
    ) : inCart;

    let cart = this.state.error ? undefined : (
      <div className="col-md-3 col-sm-12 col-xs-12">
        <div className="cart">
          <Form horizontal>
            <FormGroup controlId="seats">
              <Col xs={12}>
                <h4>Price: ${price}/Seat</h4>
                <div className="available">Seats Available: {this.state.remaining}</div>
              </Col>
              {selection}
            </FormGroup>
          </Form>
        </div>
      </div>
    );

    let img = (
      <div className="col-md-3 col-sm-3 col-xs-5">
        <img src={this.state.imgSrc} />
      </div>
    );

    let desc = (
      <div className="col-md-6 col-sm-9 col-xs-7">
        {this.props.workshop.desc}
      </div>
    );

    return (
      <div className="savvy-workshop">
        <h2 className="savvy-title">{this.props.workshop.name}</h2>
        <div className="container">
          <div className="row time">
              <div className="col-md-6 col-sm-12 cell">
                  <div><span className="fa fa-calendar-check-o"></span> {this.state.date}</div>
              </div>
              <div className="col-md-6 col-sm-12 cell">
                  <div><span className="fa fa-clock-o"></span> {this.state.time.start} - {this.state.time.end}</div>
              </div>
          </div>
          {this.state.error}
          <div className="row">
            {img}
            {desc}
            {cart}
          </div>
         <div className="row">
            <div className="col-xs-12 back">
                <span onClick={this.props.onClose} className="btn btn-link fa fa-calendar"> Back to the Calendar</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Workshop.PropTypes = {
  workshop: React.PropTypes.object,
  onClose: React.PropTypes.func
};

export default Workshop;