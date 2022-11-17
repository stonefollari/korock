import * as React from 'react'
import AppContext, { appStateReducer, defaultAppState } from './AppContext'
import { useReducer } from 'react'
import AppRouter from './AppRouter'

function App(): JSX.Element {
  const [appState, appReducer] = useReducer(appStateReducer, defaultAppState)

  return (
    <>
      <AppContext.Provider value={{ appState, appReducer }}>
        <AppRouter></AppRouter>
      </AppContext.Provider>
    </>
  )
}

export default App
