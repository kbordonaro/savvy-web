import React from 'react';
import Component from 'react-class';
import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';

import './Tags.less';
import {categories, filters, titles, excludes} from 'common/tags';

class Tags extends Component {
  constructor(props, context) {
    super(props, context);
  }

  getButtonClass(active) {
    return active ? 'btn-cta-primary' : 'btn-cta-secondary';
  }

  getIcon(active) {
    return active ? 'fa fa-check-square-o' : 'fa fa-square-o';
  }

  renderGroup(keys) {
    return (
      <ButtonGroup>
        {
          keys.map(key => {
            let idx =  this.props.tags ? this.props.tags.indexOf(key) : -1;
            let active = this.props.tags && (idx >= 0);

            let toggle = () => {
              let result = this.props.tags ? this.props.tags.slice(0) : [];
              if(active) {
                result.splice(idx, 1);
              } else {
                result.push(key);
              
                if(excludes[key]) {
                  excludes[key].forEach(exclude => {
                    let excludeIdx = result.indexOf(exclude);
                    if(excludeIdx >= 0) {
                      result.splice(excludeIdx, 1);
                    }
                  });
                }
              }

              return result;
            };

            return (
              <Button key={key} className={this.getButtonClass(active)} onClick={this.props.onChange.bind(this, toggle())}>
                <span className={this.getIcon(active)} /> {titles[key]}
              </Button>
            );
          })
        }
      </ButtonGroup>
    );
  }

  render() {
    let isAll = (!this.props.tags || this.props.tags.length === 0);

    return (
      <div className='savvy-tags'>
        <ButtonGroup>
          <Button className={this.getButtonClass(isAll)} onClick={this.props.onChange.bind(this, [])}>
            <span className={this.getIcon(isAll)} /> ALL
          </Button>
        </ButtonGroup>
        {this.renderGroup(categories)}
        {this.renderGroup(filters)}
      </div>
    );
  }
}

Tags.PropTypes = {
  tags: React.PropTypes.array,
  onChange: React.PropTypes.func.isRequired
};

export default Tags;