import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import { changeColumn } from '@asseinfo/react-kanban';

import { STATES } from 'presenters/TaskPresenter.js';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadColumnSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));
      state.board = changeColumn(state.board, column, {
        cards: items,
        meta,
      });
    },

    loadColumnMoreSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));
      state.board = changeColumn(state.board, column, {
        cards: [...column.cards, ...items],
        meta,
      });
    },
  },
});

export default tasksSlice.reducer;

export const { loadColumnSuccess, loadColumnMoreSuccess } = tasksSlice.actions;
