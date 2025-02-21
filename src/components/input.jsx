import React from 'react';
import PropTypes from 'prop-types';
import './input.css'

export const InlineInput = ({
  placeholder,
  defaultValue = '',
  negative,
  errorMessage,
  ...rest
}) => {
  const [value, setValue] = React.useState(defaultValue);
  const hiddenSpan = React.useRef(null);
  const inputRef = React.useRef(null);
  const [width, setWidth] = React.useState(0);

  const getWidth = (w) => `calc(1.1em + ${w}px)`

  React.useLayoutEffect(() => {
    if (hiddenSpan.current) {
      const content = value || placeholder;
      hiddenSpan.current.textContent = content;
      setWidth(hiddenSpan.current.offsetWidth);
    }
  }, [value, placeholder]);

  const handleChange = (e) => {
    setValue(e.target.value);
  }
  const isNegative =
    value !== 0
    && value !== '0'
    && value !== ''
    && value !== null
    && negative

  return (
    <div data-negative={isNegative || null} className='inline-input' style={{ position: 'relative', display: 'inline-block' }}>
      {/* {errorMessage ? <span className="input-error-message">{errorMessage}</span> : null} */}
      <span
        ref={hiddenSpan}
        aria-hidden="true"
        className="hidden-input-span"
        style={{
          visibility: 'hidden',
          position: 'absolute',
          witeSpace: 'pre',
          fontFamily: 'inherit',
        }}
      />
      <input
        type="text"
        defaultValue={value}
        ref={inputRef}
        onInput={handleChange}
        placeholder={placeholder}
        style={{ padding: 0, width: getWidth(width) }}
        {...rest}
      />
    </div>
  );
};

InlineInput.propTypes = {
  defaultValue: PropTypes.any,
  placeholder: PropTypes.string,
  negative: PropTypes.bool,
  errorMessage: PropTypes.string,
}
