import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import FileList from './components/FileList/FileList';

const App = () => {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth"/> }/>
        <Route path="/auth" element={<Auth/>} />
        <Route path ="/files" element={JSON.parse(localStorage.getItem('profile')) ? <FileList /> : <Auth/>} />
      </Routes>
    </BrowserRouter>
    );
}
 
export default App;