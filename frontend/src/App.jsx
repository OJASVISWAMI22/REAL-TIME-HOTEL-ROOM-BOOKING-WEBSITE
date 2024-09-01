import './App.css'
import Navbar from './components/navbar'
import {BrowserRouter, Routes,Route, Link} from 'react-router-dom'
import Homescreen from './screens/homescreen'
function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Homescreen />} />
    <Route path='/home' element={<Homescreen />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
