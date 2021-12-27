import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { AsyncPaginate } from 'react-select-async-paginate';
import { FormControl, FormHelperText, InputLabel } from '@material-ui/core';

import UsersRepository from 'repositories/UsersRepository.js';
import UserPresenter from 'presenters/UserPresenter.js';

import useStyles from './useStyles.js';

function UserSelect({ error, label, isClearable, isDisabled, isRequired, onChange, value, helperText }) {
  const styles = useStyles();
  const [isFocused, setFocus] = useState(false);

  const handleLoadOptions = (inputValue, loadedOptions, { currentPage }) =>
    UsersRepository.index({
      q: {
        firstNameOrLastNameCont: inputValue,
        s: 'first_name asc',
      },
      page: currentPage,
    }).then(({ data: { items, meta } }) => ({
      options: items,
      hasMore: meta.currentPage < meta.totalPages,
      additional: { ...meta, currentPage: meta.currentPage + 1 },
    }));

  return (
    <FormControl margin="dense" disabled={isDisabled} focused={isFocused} error={error} required={isRequired}>
      <InputLabel shrink>{label}</InputLabel>
      <div className={styles.select}>
        <AsyncPaginate
          additional={{ currentPage: 1 }}
          cacheOptions
          loadOptions={handleLoadOptions}
          defaultOptions
          getOptionLabel={(user) => UserPresenter.fullName(user)}
          getOptionValue={(user) => UserPresenter.id(user)}
          isDisabled={isDisabled}
          isClearable={isClearable}
          defaultValue={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </div>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

UserSelect.propTypes = {
  error: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: UserPresenter.shape(),
  helperText: PropTypes.string,
};

UserSelect.defaultProps = {
  isClearable: false,
  isDisabled: false,
  isRequired: false,
  value: null,
  helperText: null,
};

export default UserSelect;
