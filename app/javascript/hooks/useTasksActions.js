import { useDispatch } from 'react-redux';

import { loadColumnSuccess, loadColumnMoreSuccess } from 'slices/tasksSlice.js';
import TasksRepository from 'repositories/TasksRepository.js';
import TaskPresenter from 'presenters/TaskPresenter.js';
import TaskForm from 'forms/TaskForm.js';

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

  const changeTaskState = (task, source, destination) => {
    const transition = TaskPresenter.transitions(task).find(({ to }) => destination.toColumnId === to);
    if (!transition) return null;

    return TasksRepository.update(TaskPresenter.id(task), { ...task, state: transition.to })
      .then(() => loadColumn(source.fromColumnId))
      .then(() => loadColumn(destination.toColumnId))
      .catch((error) => alert(`Move failed! ${error.message}`));
  };

  const createTask = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => loadColumn(TaskPresenter.state(task)));
  };

  const updateTask = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.update(TaskPresenter.id(params), attributes).then(() =>
      loadColumn(TaskPresenter.state(params)),
    );
  };

  const deleteTask = (task) =>
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => loadColumn(TaskPresenter.state(task)));

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  return {
    loadColumn,
    loadColumnMore,
    changeTaskState,
    createTask,
    updateTask,
    deleteTask,
    loadTask,
  };
};
