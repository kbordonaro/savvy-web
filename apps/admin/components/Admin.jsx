import React from 'react';
import Component from 'react-class';
import $ from 'jquery';

import Login from './Login';
import Main from './Main';
import url from 'common/url';
import './Admin.less';

const View = {
  CONNECTING: 0,
  LOGIN: 1,
  MAIN: 2,
  ERROR: 3
};

// Main view of the admin application.
class Admin extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      view: View.CONNECTING
    };
  }

  componentWillMount() {
    this.setView();
  }

  // Log in to the application.
  setView() {
    $.ajax({
      method: 'HEAD',
      url: url('scripts/api.php/collection/')
    }).done(() => {
      // Successfully authenticated.
      this.setState({
        view: View.MAIN
      });
    }).fail(response => {
      this.setState({
        view: (response.status === 401) ? View.LOGIN : View.ERROR,
        response: response
      });
    });
  }

  render() {
    let view;

    switch(this.state.view) {
      case View.CONNECTING:
        break;
      case View.LOGIN:
        view = <Login onLogin={this.setView} />;
        break;
      case View.MAIN:
        view = <Main onLogout={this.setView} />;
        break;
      case View.ERROR:
        view = (<div>
          <h1>Error Occured</h1>
          <h4>{this.state.response.status} - {this.state.response.statusText}</h4>
        </div>);
        break;
    }

    return (
      <div className='savvy-admin'>
        {view}
      </div>
    );
  }
}

export default Admin;