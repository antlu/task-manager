import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import useStyles from './useStyles.js';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

function Task({ task, onClick }) {
  const styles = useStyles();

  const handleClickEdit = () => onClick(task);

  const action = (
    <IconButton onClick={handleClickEdit}>
      <EditIcon />
    </IconButton>
  );

  return (
    <Card className={styles.root}>
      <CardHeader title={task.name} action={action} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

Task.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Task;
