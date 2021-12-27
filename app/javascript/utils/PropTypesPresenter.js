import PropTypes from 'prop-types';
import { prop, keys, forEach, pipe, forEachObjIndexed } from 'ramda';

export default class PropTypesPresenter {
  constructor(propTypes, methods) {
    this.propTypes = propTypes;

    pipe(
      keys,
      forEach((name) => {
        this[name] = prop(name);
      }),
    )(propTypes);

    forEachObjIndexed((method, name) => {
      this[name] = method.bind(this);
    })(methods);
  }

  shape() {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    return PropTypes.shape(this.propTypes);
  }
}
