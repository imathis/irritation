import PropTypes from 'prop-types'
import React from 'react'

// Get all card SVG files and derive card names
const cardFiles = import.meta.glob('./*.svg')
const availableCards = Object.keys(cardFiles).map(path => {
  // Extract filename without extension from path
  return path.match(/\/(.+)\.svg$/)[1];
}).filter(Boolean)

const CardSvg = ({ name, ...rest }) => {
  const [IconComponent, setIconComponent] = React.useState(null)

  React.useEffect(() => {
    const loadCard = async () => {
      try {
        const cardModule = await cardFiles[`./${name}.svg`]()
        setIconComponent(() => cardModule.default)
      } catch (err) {
        console.error(err, `Failed to load card: ${name}`)
      } finally {
        //setLoading(false)
      }
    }

    loadCard()
  }, [name])

  return IconComponent ? <div className="game-card"><IconComponent {...rest} /></div> : null
}

CardSvg.propTypes = {
  name: PropTypes.oneOf(availableCards),
}

// Optional: Pre-cache all card SVGs for better performance
export const preloadCards = async () => {
  const loadPromises = Object.values(cardFiles).map(importFn => {
    return importFn().catch(err => {
      console.error('Failed to preload card', err)
    })
  })

  await Promise.all(loadPromises)
}


export default CardSvg
