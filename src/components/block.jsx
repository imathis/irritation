import PropTypes from 'prop-types';

const defaultPx = (input) => typeof input === 'string' ? input : `${input}px`
const spaceToPad = (props) => {
  if (Array.isArray(props)) return props.map(defaultPx).join(' ')
  return defaultPx(props)
}

export const Block = ({
  space = 0,
  style: styleProp = {},
  ...rest
}) => {
  const style = {
    padding: space ? spaceToPad(space) : null,
    ...styleProp,
  };

  return <div {...rest} style={style} />
};

Block.propTypes = {
  space: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  style: PropTypes.object,
}
