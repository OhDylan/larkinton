import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useLightMode } from '../state/lightMode'

/** Post-processing: ambient occlusion (soft contact darkening), lamp glow, filmic tone mapping, gentle vignette. */
export function Effects() {
  const evening = useLightMode() === 'evening'
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={0.5} distanceFalloff={0.5} intensity={evening ? 2 : 2.6} quality="medium" halfRes />
      <Bloom intensity={evening ? 0.8 : 0.2} luminanceThreshold={evening ? 0.8 : 1} luminanceSmoothing={0.25} mipmapBlur />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.3} darkness={evening ? 0.5 : 0.28} />
      <SMAA />
    </EffectComposer>
  )
}
