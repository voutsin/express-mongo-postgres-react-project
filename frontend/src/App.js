import React from "react";
import './App.css';
import Layout from './structure/Layout';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './config/RequireAuth';
import Home from './structure/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ROUTES from "./config/routes";

function App() {
  return (
      <Routes>
          <Route path={ROUTES.BASE.path} element={<Layout />}>
            {/* protected routes */}
            <Route element={<RequireAuth />}>
                <Route path={ROUTES.BASE.path} element={<Home />} />
            </Route>

            {/* public routes */}
            <Route exact path="login" element={<Login />}/>
            <Route exact path="register" element={<Register />}/>
          </Route>
      </Routes>
  )
}

export default App;
