import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPlublication() {
    return Tasks.find({
      $or: [
	{ private: { $ne: true } },
	{ owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});
