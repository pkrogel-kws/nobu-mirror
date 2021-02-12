import React, { useLayoutEffect, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { Effects } from './DotEffects'
import useLayers from './use-layers'
import useSlerp from './use-slerp'
import { Text, Box, useMatcapTexture, Octahedron } from '@react-three/drei'

import * as THREE from 'three'
// import './styles.css'
const TEXT_PROPS = {
  fontSize: 4.2,
  font: 'https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff'
}
// Inspired by:
// https://twitter.com/beesandbombs/status/1329796242298245124
function Title({ layers, ...props }) {
  //   const group = useRef()
  const group = useSlerp({ scalarX: 400, scalarY: 400 })

  useEffect(() => {
    group.current.lookAt(0, 0, 0)
  }, [])

  const textRef = useLayers(layers)

  return (
    <group {...props} ref={group}>
      <Text
        ref={textRef}
        name="text-panna"
        depthTest={false}
        material-toneMapped={false}
        material-color="#FFFFFF"
        {...TEXT_PROPS}>
        Nobu FM
      </Text>
    </group>
  )
}
const roundedSquareWave = (t, delta = 0.1, a = 1, f = 1 / 10) => {
  // Equation from https://dsp.stackexchange.com/a/56529
  // Visualized here https://www.desmos.com/calculator/uakymahh4u
  return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
}

function Dots({ duration, ...props }) {
  const ref = useRef()
  const { positions, distances, transform, vec } = useMemo(() => {
    const positions = [...Array(10000)].map(() => new THREE.Vector3())
    const distances = [...Array(10000)]
    const transform = new THREE.Matrix4()
    const vec = new THREE.Vector3() // reusable
    return { positions, distances, transform, vec }
  }, [])
  useLayoutEffect(() => {
    const randomAmount = 0.3
    const origin = new THREE.Vector3(0, 0, 0)
    const right = new THREE.Vector3(1, 0, 0)
    for (let i = 0; i < 10000; ++i) {
      positions[i].set(Math.floor(i / 100) - 50 + (i % 2) * 0.5, (i % 100) - 50, 0)
      positions[i].x += (Math.random() - 0.5) * randomAmount
      positions[i].y += (Math.random() - 0.5) * randomAmount
      distances[i] = positions[i].distanceTo(origin) + Math.cos(positions[i].angleTo(right) * 8) * 0.5
      transform.setPosition(positions[i])
      ref.current.setMatrixAt(i, transform)
    }
  }, [])
  useFrame(({ clock }) => {
    let dist, t, position, wave
    for (let i = 0; i < 10000; ++i) {
      position = positions[i]
      dist = distances[i]
      t = clock.elapsedTime - dist / 25 // wave is offset away from center
      wave = roundedSquareWave(t, 0.15 + (0.2 * dist) / 72, 0.4, 1 / duration)
      vec.copy(position).multiplyScalar(wave + 1.3)
      transform.setPosition(vec)
      ref.current.setMatrixAt(i, transform)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh args={[null, null, 10000]} ref={ref} {...props}>
      <circleBufferGeometry args={[0.15, 8]} />
      {/* <meshBasicMaterial color={'#555555'} /> */}
      <meshBasicMaterial color={'#FDFF79'} />
    </instancedMesh>
  )
}

export default function App() {
  return (
    <Canvas orthographic colorManagement={false} camera={{ position: [0, 0, 100], zoom: 20 }}>
      <color attach="background" args={['#080b11']} />
      <Dots duration={3.8} />
      <Title name="title" position={[0, 0, 2]} />

      <Effects />
    </Canvas>
  )
}
