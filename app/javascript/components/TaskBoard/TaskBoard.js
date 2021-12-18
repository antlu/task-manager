import React, { useState, useEffect } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import { propOr } from 'ramda';

import ColumnHeader from '../ColumnHeader';
import Task from '../Task';
import TasksRepository from '../../repositories/TasksRepository.js';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In development' },
  { key: 'in_qa', value: 'In testing' },
  { key: 'in_code_review', value: 'In review' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

function TaskBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);

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
          [state]: { ...prevState[state], cards: newItems },
        };
      });
    });
  };

  const generateBoard = () => {
    const board = {
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    };
    setBoard(board);
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  useEffect(() => generateBoard(), [boardCards]);
  useEffect(() => loadBoard(), []);

  return (
    <Board
      renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
      renderCard={(card) => <Task task={card} />}
      disableColumnDrag
    >
      {board}
    </Board>
  );
}

export default TaskBoard;
