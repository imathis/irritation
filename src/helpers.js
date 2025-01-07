const pluralizeText = ({ single, plural, count = 0 }) => {
  const size = Array.isArray(count) ? count.length : count

  if (size !== 1) {
    if (plural) {
      return plural
    }
    return single.slice(-1) === 's' ? `${single}es` : `${single}s`
  }
  return single
}

export const pluralize = (single, plural, count) => {
  if (typeof count === 'undefined') {
    // allow plural to be an optional argument
    // in this case the second argument is now counter
    return pluralizeText({ single, plural: null, count: plural })
  }

  return pluralizeText({ single, plural, count })
}
