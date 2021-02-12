import { render } from 'react-dom'
import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import { useProgress, Html } from '@react-three/drei'
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom'

import Scene1 from './Scene1'
// import Scene2 from './Scene2'
// import Scene3 from './Scene3'
import DotsScene from './DotsScene'

import './base.css'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <span style={{ color: '#FFFFFF' }}>{progress} % loaded</span>
    </Html>
  )
}

function App(props) {
  const { scene = 1 } = props
  return (
    <Canvas concurrent shadowMap camera={{ position: [0, 0, 5], fov: 70 }}>
      <color attach="background" args={['#000']} />
      <Suspense fallback={<Loader />}>
        {scene === 1 && <Scene1 />}
        {/* {scene === 2 && <Scene2 />}
        {scene === 3 && <Scene3 />} */}
        {/* {scene === 'dots' && <DotsScene />} */}
      </Suspense>
      <ambientLight intensity={0.4} />
    </Canvas>
  )
}

function Body() {
  return (
    <Router>
      <main>
        {/* <div className="frame">

        <div className="frame__demos">
          <NavLink to="/panna" activeClassName="frame__demo--current" className="frame__demo">
            PANNA
          </NavLink>
          <NavLink to="/olga" activeClassName="frame__demo--current" className="frame__demo">
            OLGA
          </NavLink>
          <NavLink to="/pedro" activeClassName="frame__demo--current" className="frame__demo">
            PEDRO
          </NavLink>
        </div>
      </div> */}
        <div className="content">
          {/* <App scene={1} /> */}
          <Switch>
            <Route exact path="/">
              {/* <Redirect to="/panna" /> */}
              <App scene={1} />
            </Route>
            {/* <Route exact path="/panna">
              <App scene={1} />
            </Route> */}
            {/* <Route exact path="/olga">
              <App scene={2} />
            </Route>
            <Route exact path="/pedro">
              <App scene={3} /> */}
            {/* </Route> */}
            <Route exact path="/music">
              <DotsScene />
            </Route>
          </Switch>

          {/* <DotsScene /> */}
        </div>
      </main>
    </Router>
  )
}

render(<Body />, document.querySelector('#root'))
