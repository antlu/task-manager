import React, { useState, useEffect } from 'react';
import Board from '@asseinfo/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import '@asseinfo/react-kanban/dist/styles.css';
import { propOr } from 'ramda';

import ColumnHeader from 'components/ColumnHeader';
import Task from 'components/Task';
import TaskForm from 'forms/TaskForm.js';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TasksRepository from 'repositories/TasksRepository.js';
import TaskPresenter from 'presenters/TaskPresenter.js';

import useStyles from './useStyles.js';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In development' },
  { key: 'in_qa', value: 'In testing' },
  { key: 'in_code_review', value: 'In review' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

function TaskBoard() {
  const styles = useStyles();
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);
  const [mode, setMode] = useState(MODES.NONE);
  const [openTaskId, setOpenTaskId] = useState(null);

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => {
        const items = prevState[state].cards;
        const newItems = [...items, ...data.items];
        return {
          ...prevState,
          [state]: { ...prevState[state], cards: newItems, meta: data.meta },
        };
      });
    });
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = TaskPresenter.transitions(task).find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(TaskPresenter.id(task), { ...task, state: transition.to })
      .then(() => {
        loadColumnInitial(source.fromColumnId);
        loadColumnInitial(destination.toColumnId);
      })
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

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(TaskPresenter.state(task));
      handleCloseAddPopup();
    });
  };

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleCardUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);
    return TasksRepository.update(TaskPresenter.id(task), attributes).then(() => {
      loadColumnInitial(TaskPresenter.state(task));
      handleCloseEditPopup();
    });
  };

  const handleCardDestroy = (task) =>
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumnInitial(TaskPresenter.state(task));
      handleCloseEditPopup();
    });

  const generateBoard = () => {
    setBoard({
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr([], 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    });
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  useEffect(() => generateBoard(), [boardCards]);
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
      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleCloseAddPopup} />}
      {mode === MODES.EDIT && (
        <EditPopup
          cardId={openTaskId}
          onCardLoad={loadTask}
          onCardUpdate={handleCardUpdate}
          onCardDestroy={handleCardDestroy}
          onClose={handleCloseEditPopup}
        />
      )}
    </>
  );
}

export default TaskBoard;
