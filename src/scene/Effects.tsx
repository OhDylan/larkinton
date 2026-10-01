import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useLightMode } from '../state/lightMode'

/**
 * Post-processing: ambient occlusion (soft contact darkening), filmic tone mapping, gentle vignette;
 * lamp glow (bloom) only in the evening, when there's something to glow.
 * AO runs at half resolution: most of the look for a fraction of the cost.
 */
export function Effects() {
  const evening = useLightMode() === 'evening'
  if (evening)
    return (
      <EffectComposer key="evening" multisampling={0}>
        <N8AO aoRadius={0.5} distanceFalloff={0.5} intensity={2} quality="medium" halfRes />
        <Bloom intensity={0.8} luminanceThreshold={0.8} luminanceSmoothing={0.25} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        <Vignette offset={0.3} darkness={0.5} />
        <SMAA />
      </EffectComposer>
    )
  return (
    <EffectComposer key="day" multisampling={0}>
      <N8AO aoRadius={0.5} distanceFalloff={0.5} intensity={2.6} quality="medium" halfRes />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.3} darkness={0.28} />
      <SMAA />
    </EffectComposer>
  )
}
