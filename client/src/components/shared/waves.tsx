import Wave from 'react-wavify'
import { GOOD_WEATHER_COLORS } from '../../constants/theme'


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