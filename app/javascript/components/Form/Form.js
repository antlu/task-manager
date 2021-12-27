import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import TextField from '@material-ui/core/TextField';

import UserSelect from 'components/UserSelect';
import TaskPresenter from 'presenters/TaskPresenter.js';

import useStyles from './useStyles';

function Form({ errors, onChange, task, selects }) {
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
      {selects.map(({ name, props }) => (
        <UserSelect
          key={name}
          error={has(name, errors)}
          helperText={errors[name]}
          onChange={handleChangeSelect(name)}
          value={TaskPresenter[name](task)}
          label={`${name[0].toUpperCase()}${name.substring(1)}`}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      ))}
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
  selects: PropTypes.arrayOf(PropTypes.object),
};

Form.defaultProps = {
  errors: {},
  selects: [],
};

export default Form;
