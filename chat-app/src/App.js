import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Chat from './Pages/Chat/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element = {<Login />} />
        <Route path='/register' element = {<Register />} />
        <Route path='/' element = {<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
