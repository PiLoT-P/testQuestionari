import { HashRouter } from "react-router-dom"
import { useRoutes } from "./routes/useRoutes"

function App() {
  const routes = useRoutes();

  return (  
    <HashRouter>{routes}</HashRouter>
  )
}

export default App
