import React from "react";
import './App.css';
import Layout from './structure/Layout';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './config/RequireAuth';
import Home from './structure/Home';
import Login from './components/Auth/Login';

function App() {
  return (
      <Routes>
          <Route path="/" element={<Layout />}>
            {/* protected routes */}
            <Route element={<RequireAuth />}>
                <Route path="/" element={<Home />} />
            </Route>

            {/* public routes */}
            <Route exact path="login" element={<Login />}/>
            {/* <Route exact path="register" element={<SignContainer registerNew={true} />}/> */}
          </Route>
      </Routes>
  )
}

export default App;
