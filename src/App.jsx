import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
import Layout from './layout/Layout';
import Journal from './components/Jurnal';
import Nutrition from './components/Nutrition';
import Disclaimer from './components/Disclaimer';
import MindfulnessPage from './components/MindfulnessPage';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/journal"
          element={
            <PrivateRoute>
              <Layout>
                <Journal />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <PrivateRoute>
              <Layout>
                <Nutrition />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/meditation"
          element={
            <PrivateRoute>
              <Layout>
                <MindfulnessPage />
              </Layout>
            </PrivateRoute>
          }
        />



        <Route path="/" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;
