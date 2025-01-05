import PropTypes from 'prop-types'
import CardSvg from '../assets/cards'
import './card-fan.css'

export const CardFan = ({ cards, reverse }) => {
  return (<div className="card-fan">
    {cards.map(card => {
      return (<CardSvg name={card} key={card} />)
    })}
  </div>)
}

CardFan.propTypes = {
  cards: PropTypes.array,
  reverse: PropTypes.bool,
}
