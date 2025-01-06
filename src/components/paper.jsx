import './paper.css'
import { Block } from './block'

export const PaperRow = ({
  rule, space, className, line = true,
  ...rest
}) => (
  <div className={`${className || ''} paper-line`} data-line={line || null}>
    {rule || <span />}
    <Block className="paper-row" space={space} {...rest} />
  </div>
)
export const PaperPage = ({ children }) => (
  <div className='paper-page'>
    {children}
  </div>
)
