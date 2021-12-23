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
