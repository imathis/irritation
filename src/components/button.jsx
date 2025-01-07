import { Button } from "@ariakit/react"
import './button.css'

export const MainButton = ({ className, ...props }) => (
  <Button className={`main-button ${className || ''}`} {...props} />
)
