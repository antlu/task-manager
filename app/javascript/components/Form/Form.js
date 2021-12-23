import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import TextField from '@material-ui/core/TextField';

import UserSelect from 'components/UserSelect';
import TaskPresenter from 'presenters/TaskPresenter.js';

import useStyles from './useStyles';

function Form({ errors, onChange, task }) {
  const styles = useStyles();
  const handleChangeTextField = (fieldName) => (event) => onChange({ ...task, [fieldName]: event.target.value });
  const handleChangeSelect = (fieldName) => (user) => onChange({ ...task, [fieldName]: user });

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        onChange={handleChangeTextField('name')}
        value={TaskPresenter.name(task)}
        label="Name"
        margin="dense"
        required
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        onChange={handleChangeTextField('description')}
        value={TaskPresenter.description(task)}
        label="Description"
        margin="dense"
        required
        multiline
      />
      <UserSelect
        error={has('author', errors)}
        helperText={errors.author}
        onChange={handleChangeSelect('author')}
        value={TaskPresenter.author(task)}
        label="Author"
        isRequired
        isDisabled
      />
      <UserSelect
        error={has('assignee', errors)}
        helperText={errors.assignee}
        onChange={handleChangeSelect('assignee')}
        value={TaskPresenter.assignee(task)}
        label="Assignee"
        isRequired
        isClearable
      />
    </form>
  );
}

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  task: TaskPresenter.shape().isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string),
  }),
};

Form.defaultProps = {
  errors: {},
};

export default Form;
