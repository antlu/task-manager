import React, { useState, useEffect } from 'react';
import Board from '@asseinfo/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import '@asseinfo/react-kanban/dist/styles.css';

import ColumnHeader from 'components/ColumnHeader';
import Task from 'components/Task';
import TaskForm from 'forms/TaskForm.js';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TasksRepository from 'repositories/TasksRepository.js';
import TaskPresenter from 'presenters/TaskPresenter.js';
import useTasksActions from 'hooks/useTasksActions.js';
import useTasks from 'hooks/useTasks.js';

import useStyles from './useStyles.js';

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

function TaskBoard() {
  const styles = useStyles();
  const { board, loadBoard } = useTasks();
  const [mode, setMode] = useState(MODES.NONE);
  const [openTaskId, setOpenTaskId] = useState(null);

  const { loadColumn, loadColumnMore } = useTasksActions();

  const handleCardDragEnd = (task, source, destination) => {
    const transition = TaskPresenter.transitions(task).find(({ to }) => destination.toColumnId === to);
    if (!transition) return null;

    return TasksRepository.update(TaskPresenter.id(task), { ...task, state: transition.to })
      .then(() => loadColumn(source.fromColumnId))
      .then(() => loadColumn(destination.toColumnId))
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleOpenAddPopup = () => setMode(MODES.ADD);

  const handleCloseAddPopup = () => setMode(MODES.NONE);

  const handleOpenEditPopup = (task) => {
    setMode(MODES.EDIT);
    setOpenTaskId(TaskPresenter.id(task));
  };

  const handleCloseEditPopup = () => {
    setMode(MODES.NONE);
    setOpenTaskId(null);
  };

  const handleCardCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumn(TaskPresenter.state(task));
      handleCloseAddPopup();
    });
  };

  const handleCardLoad = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleCardUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);
    return TasksRepository.update(TaskPresenter.id(task), attributes).then(() => {
      loadColumn(TaskPresenter.state(task));
      handleCloseEditPopup();
    });
  };

  const handleCardDestroy = (task) =>
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumn(TaskPresenter.state(task));
      handleCloseEditPopup();
    });

  useEffect(() => loadBoard(), []);

  return (
    <>
      <Board
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        renderCard={(card) => <Task task={card} onClick={handleOpenEditPopup} />}
        disableColumnDrag
        onCardDragEnd={handleCardDragEnd}
      >
        {board}
      </Board>
      <Fab className={styles.addButton} color="primary" aria-label="add" onClick={handleOpenAddPopup}>
        <AddIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCardCreate={handleCardCreate} onClose={handleCloseAddPopup} />}
      {mode === MODES.EDIT && (
        <EditPopup
          cardId={openTaskId}
          onCardLoad={handleCardLoad}
          onCardUpdate={handleCardUpdate}
          onCardDestroy={handleCardDestroy}
          onClose={handleCloseEditPopup}
        />
      )}
    </>
  );
}

export default TaskBoard;
