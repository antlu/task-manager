import React, { useState, useEffect } from 'react';
import Board from '@asseinfo/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import '@asseinfo/react-kanban/dist/styles.css';

import ColumnHeader from 'components/ColumnHeader';
import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
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

  const { loadColumnMore, changeTaskState, createTask, updateTask, deleteTask, loadTask } = useTasksActions();

  const handleCardDragEnd = (task, source, destination) => changeTaskState(task, source, destination);

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

  const handleCardCreate = (params) => createTask(params).then(() => handleCloseAddPopup());

  const handleCardLoad = (id) => loadTask(id);

  const handleCardUpdate = (params) => updateTask(params).then(() => handleCloseEditPopup());

  const handleCardDestroy = (task) => deleteTask(task).then(() => handleCloseEditPopup());

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
