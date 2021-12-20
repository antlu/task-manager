import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import useStyles from './useStyles.js';

function ColumnHeader({ column, onLoadMore }) {
  const styles = useStyles();
  const {
    id,
    title,
    cards,
    meta: { totalCount, currentPage },
  } = column;
  const count = cards.length;

  const handleLoadMore = () => onLoadMore(id, currentPage + 1);

  return (
    <div className={styles.root}>
      <div>
        <b>{title}</b> ({count}/{totalCount || '...'})
      </div>
      <div>
        {count < totalCount && (
          <IconButton arial-label="Load more" onClick={handleLoadMore}>
            <SystemUpdateAltIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  );
}

ColumnHeader.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    cards: PropTypes.arrayOf(PropTypes.object),
    // eslint-disable-next-line react/forbid-prop-types
    meta: PropTypes.object,
  }).isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default ColumnHeader;
