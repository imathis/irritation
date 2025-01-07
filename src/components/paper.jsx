import './paper.css'
import { Block } from './block'
import { Layout } from './layout'
import { MainButton } from './button'

export const PaperRow = ({
  rule, space, className, line = true,
  ...rest
}) => (
  <div className={`${className || ''} paper-line`} data-line={line || null}>
    {rule || <span />}
    <Block className="paper-row" space={space} {...rest} />
  </div>
)

export const PaperNavButton = (props) => (
  <MainButton className="paper-nav-button" {...props} />
)
export const PaperPage = ({ children }) => (
  <Layout className='paper-page'>
    {children}
  </Layout>
)
