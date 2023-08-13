import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Home from './components/Home';
import Login from './components/Login';
import ErrorPage from './components/ErrorPage';
import SignUp from './components/SignUp';
import QuickGame from './components/QuickGame';
import Play from './components/Play';
import Profile from './components/Profile';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position='bottom-right'/>
      <Router>
        <Routes>
          <Route path="/app/*" element={<AppLayout />}>
            <Route path="quickgame" element={<QuickGame />} />
            <Route path="play" element={<Play />} />
            <Route path="profile" element={<Profile/>}/>
            <Route path="*" element={<ErrorPage/>}/>
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
