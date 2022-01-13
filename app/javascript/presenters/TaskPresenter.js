import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';
import UserPresenter from 'presenters/UserPresenter.js';

export default new PropTypesPresenter(
  {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    state: PropTypes.string,
    transitions: PropTypes.array,
    author: UserPresenter.shape(),
    assignee: UserPresenter.shape(),
  },
  {},
);

export const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In development' },
  { key: 'in_qa', value: 'In testing' },
  { key: 'in_code_review', value: 'In review' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];
