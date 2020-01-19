import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-class';
import $ from 'jquery';
import moment from 'moment';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

import Collection from 'collection/components/Collection';
import Calendar from 'calendar/components/Calendar';
import WorkshopDialog from './WorkshopDialog';
import CollectionDialog from './CollectionDialog';
import DeleteItemDialog from './DeleteItemDialog';
import Event from './Event';
import url from 'common/url';
import workshops, {MONTHS} from 'calendar/events/workshops';
import './Main.less';

const Views = {
  CALENDAR: 0,
  COLLECTION: 1
};

// Main view.
class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      view: Views.CALENDAR,
      events: [],
      date: moment()
    };
  }

  componentWillMount() {
    this.setEvents();
  }

  setEvents() {
    workshops(events => {
      this.setState({
        events: events
      });
    }, response => {
      console.error(response);
      alert('READ WORKSHOPS FAILED! Tell Keith!');
    });
  }

  // Handle the logout event.
  onLogout() {
    $.ajax({
      type: 'POST',
      url: url('scripts/logout.php'),
    }).done(() => {
      // Successfully logged in, change view.
      this.props.onLogout();
    }).fail(response => {
      console.error('Failed to logout', response);
    });
  }

  // Handle the collection event.
  onCollection() {
    this.setState({
      view: Views.COLLECTION
    });
  }

  // Handle the calendar event.
  onCalendar() {
    this.setState({
      view: Views.CALENDAR
    });
  }

  // Open the dialog for editing.
  onOpenEdit(item) {
    this.setState({
      showCollectionDialog: true,
      item,
      dialogTitle: 'Edit Collection Item'
    });
  }

  // Open the dialog for adding.
  onOpenAdd() {
    this.setState({
      showCollectionDialog: true,
      item: undefined,
      dialogTitle: 'Add Collection Item'
    });
  }

  onOpenDelete(item) {
    this.setState({
      showDeleteItemDialog: true,
      item
    });
  }

  // Close the collection dialog.
  onCloseDialog(refresh) {
    this.setState({
      showCollectionDialog: false,
      showDeleteItemDialog: false,
      showWorkshopDialog: false
    }, () => {
      if(refresh && this.refs.collection) {
        this.refs.collection.getCollection();
      }

      if(this.state.view === Views.CALENDAR) {
        this.setEvents();
      }
    });
  }

  // Handle a month selection event from the toolbar.
  onMonth(date) {
    this.setState({
      date
    });
  }

  // Switch to the view to a an workshop view.
  onWorkshop(workshop) {
    this.setState({
      showWorkshopDialog: true,
      workshop
    });
  }

  render() {
    let view;
    let nav;
    switch(this.state.view) {
      case Views.CALENDAR:
        view = (
          <Calendar
            alwaysEnable={true}
            months={MONTHS}
            comp={Event}
            date={this.state.date}
            events={this.state.events}
            onMonth={this.onMonth}
            onEvent={this.onWorkshop} />
        );

        nav = (
          <Nav>
            <NavItem eventKey={1} onClick={this.onCollection}>Collection</NavItem>
          </Nav>
        );
        break;
      case Views.COLLECTION:
        view = (
          <Collection
            ref='collection'
            onEdit={this.onOpenEdit}
            onDelete={this.onOpenDelete} />
        );

        nav = [(
          <Nav>
            <NavItem key='calendar' eventKey={1} onClick={this.onCalendar}>Calendar</NavItem>
          </Nav>
        ),(
          <Nav>
            <NavItem key='add' eventKey={2} onClick={this.onOpenAdd}>Add Item</NavItem>
          </Nav>
        )];
        break;
      default:
        break;
    }

    return (
      <div className='savvy-main'>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              Savvy Creations
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            {nav}
            <Nav pullRight>
              <NavItem eventKey={1} onClick={this.onLogout}>Logout</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {view}
        <WorkshopDialog
          show={this.state.showWorkshopDialog}
          workshop={this.state.workshop}
          onClose={this.onCloseDialog} />
        <CollectionDialog
          show={this.state.showCollectionDialog}
          title={this.state.dialogTitle}
          item={this.state.item}
          onClose={this.onCloseDialog} />
        <DeleteItemDialog
          show={this.state.showDeleteItemDialog}
          item={this.state.item}
          onClose={this.onCloseDialog} />
      </div>
    );
  }
}

Main.PropTypes = {
  onLogout: React.PropTypes.func.isRequired
};

export default Main;