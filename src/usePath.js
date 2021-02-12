import React from 'react'

// I wanted to synchronize my app state with the path using pushstate, but I didn't
// want the full overhead of React Router.

// This turned out to do the job perfectly

const usePath = () => {
  const initialPath = window.location.pathname.substr(1)

  const [path, setPath] = React.useState(initialPath)

  const changePath = (path) => {
    window.history.pushState({}, path, `/${path}`)
    setPath(path)
  }

  React.useEffect(() => {
    window.__UPDATE_ROUTE = (route) => {
      console.log('window.__UPDATE_ROUTE', route)
      setPath(route)
    }

    window.onpopstate = () => {
      setPath(window.location.pathname.substr(1))
    }
    return () => {
      window.onhashchange = null
    }
  }, [])

  return [path, changePath]
}

export default usePath
