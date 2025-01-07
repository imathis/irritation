import PropTypes from 'prop-types';

const defaultPx = (input) => typeof input === 'string' ? input : `${input}px`
const spaceToPad = (props) => {
  if (Array.isArray(props)) return props.map(defaultPx).join(' ')
  return defaultPx(props)
}

export const Grid = ({
  gap = 0,
  rowGap = gap,
  space = 0,
  align = 'start',
  valign = 'start',
  templateColumns,
  templateRows,
  autoColumns,
  shelf,
  stack,
  split,
  children,
  reverse,
  grow,
  maxWidth,
  style: styleProp = {},
}) => {
  const style = {
    display: 'grid',
    gap: gap ? defaultPx(gap) : null,
    rowGap: rowGap ? defaultPx(rowGap) : null,
    padding: space ? spaceToPad(space) : null,
    alignItems: valign,
    justifyItems: align,
    gridTemplateColumns: templateColumns,
    gridTemplateRows: templateRows,
    width: grow ? '100%' : null,
    maxWidth: maxWidth ? defaultPx(maxWidth) : null,
    ...styleProp,
  };
  if (autoColumns) {
    style.gridAutoColumns = autoColumns === true ? 'auto' : autoColumns
  }
  if (shelf) {
    style.gridTemplateColumns = 'repeat(auto-fit, minmax(min-content, max-content))'
    style.gridAutoFlow = 'column'
    style.justifyContent = 'start'
    if (split) {
      style.justifyContent = 'space-between'
    }
  }
  if (stack) {
    style.gridTemplateRows = 'repeat(auto-fit, minmax(min-content, max-content))'
    style.justifyItems = 'stretch'
    if (split) {
      style.alignContent = 'space-between'
    }
  }
  if (reverse) {
    style.direction = 'rtl'
  }
  return <div style={style}>{children}</div>;
};

Grid.propTypes = {
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowGap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.string,
  valign: PropTypes.string,
  space: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  templateColumns: PropTypes.string,
  templateRows: PropTypes.string,
  children: PropTypes.node,
  autoColumns: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  shelf: PropTypes.bool,
  stack: PropTypes.bool,
  split: PropTypes.bool,
  reverse: PropTypes.bool,
  style: PropTypes.object,
  grow: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
