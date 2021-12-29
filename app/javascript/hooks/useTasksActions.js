import { useDispatch } from 'react-redux';

import { loadColumnSuccess, loadColumnMoreSuccess } from 'slices/tasksSlice.js';
import TasksRepository from 'repositories/TasksRepository.js';

export default () => {
  const dispatch = useDispatch();

  const makeColumnLoader =
    (actionCreator) =>
    (state, page = 1, perPage = 10) =>
      TasksRepository.index({
        q: { stateEq: state },
        page,
        perPage,
      }).then(({ data }) => {
        dispatch(actionCreator({ ...data, columnId: state }));
      });

  const loadColumn = makeColumnLoader(loadColumnSuccess);

  const loadColumnMore = makeColumnLoader(loadColumnMoreSuccess);

  return {
    loadColumn,
    loadColumnMore,
  };
};
