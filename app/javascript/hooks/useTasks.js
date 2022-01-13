import { useSelector } from 'react-redux';

import { STATES } from 'presenters/TaskPresenter.js';
import useTasksActions from 'hooks/useTasksActions.js';

export default () => {
  const board = useSelector((state) => state.tasks.board);
  const { loadColumn } = useTasksActions();
  const loadBoard = () => STATES.map(({ key }) => loadColumn(key));

  return {
    board,
    loadBoard,
  };
};
