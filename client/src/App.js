import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import UserList from './components/userList/UserList';
import ActionList from './components/actionList/ActionList';
import Auth from './components/Auth/Auth';

function App() {

  //ovo na kraju ako mi se bude dalo za isticanje
  /*useEffect(()=>{
    //JWT...
    setUser(JSON.parse(localStorage.getItem('profile')));
  },[location]);*/

  //posalji usera samo dolje u komponente
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth"/> }/>
        <Route path="/auth" element={<Auth/>} />
        <Route path ="/users" element={JSON.parse(localStorage.getItem('profile')) ? <UserList /> : <Auth/>} />
        <Route path="/actions" element={JSON.parse(localStorage.getItem('profile')) ? <ActionList /> : <Auth/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
