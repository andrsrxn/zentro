export const capitalizeFirstLetter = (str: string) => {
  if (!str) {
    return ''
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitalizeAllWords = (str: string) => {
  if (!str) {
    return ''
  }
  return str.split(' ').map(capitalizeFirstLetter).join(' ')
}
