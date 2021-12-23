import { pick, propOr } from 'ramda';
import TaskPresenter from 'presenters/TaskPresenter.js';

export default {
  defaultAttributes(attributes) {
    return {
      name: '',
      description: '',
      ...attributes,
    };
  },

  attributesToSubmit(task) {
    const permittedKeys = ['id', 'name', 'description'];
    return {
      ...pick(permittedKeys, task),
      assigneeId: propOr(null, 'id', TaskPresenter.assignee(task)),
      authorId: propOr(null, 'id', TaskPresenter.author(task)),
    };
  },
};
