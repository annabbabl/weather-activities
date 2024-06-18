import Wave from 'react-wavify'

const StandartBlueWave = () => (
  <Wave fill={"Blue"}
        paused={false}
        style={{ display: 'flex', width:"400%"}}
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3, 
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