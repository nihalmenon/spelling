import logo from './logo.svg';
import './App.css';
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import ErrorPage from './components/ErrorPage';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import Play from './components/Play'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path ="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="*" Component={ErrorPage}/>
        <Route path="/profile" Component={Profile}/>
        <Route path="/signup" Component={SignUp} />
        <Route path='/play' Component={Play}/>
      </Routes>
    </Router>
  );
}

export default App;