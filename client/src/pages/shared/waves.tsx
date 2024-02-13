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

export {
  StandartBlueWave
}