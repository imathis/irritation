import { Block } from '../components/block'
import './heading.css'

const TitleText = () => {
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
  );
};

export const Title = () => (
  <Block space={['10vh', '0', '15vh']} style={{ textAlign: 'center' }}>
    <TitleText />
  </Block>
)

export const Heading = ({ text }) => {
  return (
    <div className="heading-wrapper">
      <div className="heading">
        <h2>{text}</h2>
      </div>
    </div>
  )
}
