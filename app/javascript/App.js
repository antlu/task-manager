import React from 'react';
import { Provider } from 'react-redux';

import store from 'store.js';
import TaskBoard from 'components/TaskBoard';

function App() {
  return (
    <Provider store={store}>
      <TaskBoard />
    </Provider>
  );
}

export default App;
