import { useState, useEffect } from 'preact/hooks'

/**
 * @param {{ images: Array }} props
 */
export default function DynamicBackground({ images }) {
  const [index1, setIndex1] = useState(0),
    [index2, setIndex2] = useState(1),
    [secondDivOpaque, setSecondDivOpaque] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondDivOpaque(prior => !prior)
      setTimeout(
        () =>
          secondDivOpaque
            ? setIndex2(prior => (prior + 2) % images.length)
            : setIndex1(prior => (prior + 2) % images.length),
        500
      )
    }, 1_500)
    return () => clearInterval(interval)
  })

  return (
    <>
      <div
        className='background_image opaque'
        style={{ backgroundImage: `url(${images[index1]})` }}
      />
      <div
        className={`background_image ${secondDivOpaque ? 'opaque' : ''}`}
        style={{ backgroundImage: `url(${images[index2]})` }}
      />
    </>
  )
}
