import './paper.css'
import { Block } from './block'

export const PaperRow = ({ rule, space, ...rest }) => (
  <div className="paper-line">
    {rule || <span />}
    <Block className="paper-row" space={space} {...rest} />
  </div>
)
export const PaperHeading = ({ rule, space, ...rest }) => (
  <div className="paper-line">
    {rule || <span />}
    <Block className="paper-row paper-heading" space={space} {...rest} />
  </div>
)

export const PaperPage = ({ children }) => (
  <div className='paper-page'>
    {children}
  </div>
)

export const PaperFooter = ({ rule, space, ...rest }) => (
  <div className="paper-footer">
    {rule || <span />}
    <Block className="paper-row" space={space} {...rest} />
  </div>
)
