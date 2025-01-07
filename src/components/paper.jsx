import './paper.css'
import { Block } from './block'
import { Layout } from './layout'

export const PaperRow = ({
  rule, space, className, line = true,
  ...rest
}) => (
  <div className={`${className || ''} paper-line`} data-line={!line ? 'none' : null}>
    {rule || <span />}
    <Block className="paper-row" space={space} {...rest} />
  </div>
)

export const PaperPage = ({ children }) => (
  <Layout className='paper-page'>
    {children}
  </Layout>
)
