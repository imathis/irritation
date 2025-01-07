import { Button } from "@ariakit/react"
import './button.css'

export const MainButton = ({ className, ...props }) => (
  <Button className={`main-button ${className || ''}`} {...props} />
)

export const ActionButton = (props) => (
  <MainButton className="action-button" {...props} />
)
