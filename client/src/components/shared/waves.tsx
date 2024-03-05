import Wave from 'react-wavify'
import { GOOD_WEATHER_COLORS } from '../../constants/theme'

/**
 * Functional React component for displaying a standard blue wave animation.
 * This component utilizes the 'react-wavify' library to render a smooth, animated wave
 * using the predefined good weather color from the application's theme.
 * The wave is configured with specific height, amplitude, speed, and points for the desired visual effect.
 *
 * @component
 * @example
 * <StandartBlueWave />
 *
 * @returns {React.ReactElement} A React component representing a blue wave animation.
 */

const StandartBlueWave = () => (
  <Wave fill={GOOD_WEATHER_COLORS.thirdColor}
        paused={false}
        style={{ display: 'flex' }}
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3
        }}
  />
)

/**
 * Functional React component for displaying a red-orange gradient wave animation.
 * This component utilizes the 'react-wavify' library with a linear gradient fill
 * transitioning from gold to red. The gradient is applied vertically from top to bottom.
 * This wave component provides a vibrant, dynamic background element for the application.
 *
 * @component
 * @example
 * <RedOrangeWave />
 *
 * @returns {React.ReactElement} A React component representing a red-orange gradient wave animation.
 */
const RedOrangeWave = () => (
  <Wave fill="url(#gradient)">
  <defs>
    <linearGradient id="gradient" gradientTransform="rotate(90)">
      <stop offset="10%"  stopColor="#d4af37" />
      <stop offset="90%" stopColor="#f00" />
    </linearGradient>
  </defs>
</Wave>
)

export {
  StandartBlueWave,
  RedOrangeWave
}