import { Block } from './block'
import './title.css'
import { pluralize } from '../helpers'

export const formatBooksAndRuns = ({ books, runs }) => {
  const items = []
  if (books) items.push(`${books} ${pluralize('book', books)}`)
  if (runs) items.push(`${runs} ${pluralize('run', runs)}`)

  if (runs > books) return items.reverse()
  return items
}

const MainTitleText = () => {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ fill: 'currentColor' }}
      viewBox="0 0 100 40"
      role="img" // Indicates this is an image
      aria-labelledby="titleText"
      className="main-title"
    >
      <title id="titleText">Let‘s Play Irritation</title>
      <text
        x="50%"
        y="15%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="14"
        className="main-title-intro"
      >
        Let‘s Play
      </text>
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="25"
        className="main-title-name"
      >
        Irritation
      </text>
      <text
        x="50%"
        y="90%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="8"
        className="main-title-quote"
      >
        “Who dealt this mess?”
      </text>
    </svg>
  )
}
const RoundTitleText = ({
  round,
  dealer,
  deal,
  books,
  runs,
}) => {
  const collecting = formatBooksAndRuns({ books, runs })
  const joiner = round === 8 ? 'or ' : '+ '

  return (
    <svg
      width="100%"
      height="100%"
      style={{ fill: 'currentColor' }}
      viewBox={`0 0 70 ${collecting.length === 1 ? 35 : 55}`}
      role="img" // Indicates this is an image
      aria-labelledby="titleText"
      className="round-title"
    >
      <text
        x="52%"
        y="5px"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="11"
        className="round"
      >
        Round {round}
      </text>
      {collecting.map((title, index) => (
        <text
          key={title}
          x="50%"
          y={`${(index * 18) + 19}px`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="19"
        >
          {index ? joiner : ''}{title}
        </text>
      ))}
      <text
        x="49%"
        y={collecting.length === 1 ? '32px' : '50px'}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="6.5"
        className="dealer"
      >
        {dealer} Deals {deal} cards
      </text>
    </svg>
  )
}

export const MainTitle = () => (
  <Block space={['10vh', '0', '15vh']} style={{ textAlign: 'center' }}>
    <MainTitleText />
  </Block>
)

export const RoundTitle = (props) => (
  <Block space={['10vh', '0', '15vh']} style={{ textAlign: 'center' }}>
    <RoundTitleText {...props} />
  </Block>
)
