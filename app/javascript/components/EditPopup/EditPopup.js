import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import Form from '../Form';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Modal,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import TaskPresenter from 'presenters/TaskPresenter.js';

import useStyles from './useStyles.js';

function EditPopup({ cardId, onClose, onCardDestroy, onCardLoad, onCardUpdate }) {
  const styles = useStyles();
  const [task, setTask] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => onCardLoad(cardId).then(setTask), []);

  const handleCardUpdate = () => {
    setSaving(true);

    onCardUpdate(task).catch((error) => {
      setSaving(false);
      setErrors(error || {});
      if (error instanceof Error) {
        alert(`Update failed. Error: ${error.message}`);
      }
    });
  };

  const handleCardDestroy = () => {
    setSaving(true);

    onCardDestroy(task).catch((error) => {
      setSaving(false);
      alert(`Destruction failed. Error ${error.message}`);
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
          title={isLoading ? 'Task is loading' : `Task #${TaskPresenter.id(task)} [${TaskPresenter.name(task)}]`}
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
              selects={[
                { name: 'author', props: { isDisabled: true } },
                { name: 'assignee', props: { isClearable: true } },
              ]}
            />
          )}
        </CardContent>
        <CardActions className={styles.actions}>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardUpdate}
            size="small"
            variant="contained"
            color="primary"
          >
            Update
          </Button>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardDestroy}
            size="small"
            variant="contained"
            color="secondary"
          >
            Destroy
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

EditPopup.propTypes = {
  cardId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardLoad: PropTypes.func.isRequired,
  onCardUpdate: PropTypes.func.isRequired,
  onCardDestroy: PropTypes.func.isRequired,
};

export default EditPopup;
