import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';

// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }
  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }
  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }
  render() {
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });

    return (
      <li className={taskClassName}>
	<input type="checkbox" checked={this.props.task.checked} onChange={this.toggleChecked.bind(this)} />
	<button className="delete" onClick={this.deleteThisTask.bind(this)}>X</button>
	{this.props.showPrivateButton ? (
	   <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
	     { this.props.task.private ? 'Private0' : 'Public0' }
	   </button>
	 ) : ''}
	<span className="text"><strong>{this.props.task.username}</strong>:{this.props.task.text}</span>
      </li>
    );
  }
}

Task.propsTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired,
};
