// import './App.css'
import { Outlet } from 'react-router-dom'
import { Footer, Header } from './components/index'

function App() {

  return (
    <>
      <div>
        <Header/>
        <Outlet/>
        <Footer/>
      </div>
    </>
  )
}

export default App
