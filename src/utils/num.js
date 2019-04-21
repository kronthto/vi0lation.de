export function floatNormalizer(num) {
  if (Math.abs(num) < 0.0001) {
    return 0
  }
  return num
}

export const formatNum = (num, precision = 3) => {
  let floatNorm = floatNormalizer(num)
  if (floatNorm === 0) {
    return 0
  }
  return num.toFixed(precision)
}
