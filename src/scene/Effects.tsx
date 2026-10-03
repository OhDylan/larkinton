import { Bloom, EffectComposer, HueSaturation, N8AO, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import type { CameraMode } from '../controls/CameraRig'
import { useLightMode } from '../state/lightMode'

/**
 * Photographic post-processing, following the recipe sael.net's configurator uses (also three.js):
 * ambient occlusion, ACES filmic tone mapping with a touch of extra saturation, SMAA for clean
 * edges, bloom on the lamps in the evening, vignette.
 * (Depth of field was tried and dropped: it blurred the whole frame in this effect chain.)
 */
export function Effects(_: { mode: CameraMode }) {
  const evening = useLightMode() === 'evening'
  return (
    <EffectComposer key={`${evening}`} multisampling={0}>
      <N8AO aoRadius={0.55} distanceFalloff={0.55} intensity={evening ? 2.2 : 3.2} quality="medium" halfRes />
      <>{evening && <Bloom intensity={0.6} luminanceThreshold={0.9} luminanceSmoothing={0.25} mipmapBlur />}</>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <HueSaturation saturation={0.06} />
      <Vignette offset={0.3} darkness={evening ? 0.55 : 0.4} />
      <SMAA />
    </EffectComposer>
  )
}
