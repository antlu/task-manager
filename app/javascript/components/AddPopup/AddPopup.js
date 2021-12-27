import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { CardActions, CardContent, CardHeader, CircularProgress, IconButton, Modal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Form from '../Form';
import TaskForm from 'forms/TaskForm.js';

import useStyles from './useStyles.js';

function AddPopup({ onClose, onCreateCard }) {
  const styles = useStyles();
  const [task, setTask] = useState(TaskForm.defaultAttributes());
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCardCreate = () => {
    setSaving(true);

    onCreateCard(task).catch((error) => {
      setSaving(false);
      setErrors(error || {});
      if (error instanceof Error) {
        alert(`Creation failed. Error: ${error.message}`);
      }
    });
  };

  const isLoading = isNil(task);

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title="Add New Task"
        />
        <CardContent>
          {isLoading ? (
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          ) : (
            <Form
              errors={errors}
              onChange={setTask}
              task={task}
              selects={[{ name: 'assignee', props: { isClearable: true } }]}
            />
          )}
        </CardContent>
        <CardActions className={styles.actions}>
          <Button disabled={isSaving} onClick={handleCardCreate} variant="contained" size="small" color="primary">
            Add
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

AddPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreateCard: PropTypes.func.isRequired,
};

export default AddPopup;
