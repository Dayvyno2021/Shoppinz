// import { useState } from 'react';
import './App.scss'
import Footer from './components/Footer'
import Header from './components/Header'
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Header />
        <main className="min-h-[80vh]">
          <Outlet />
        </main>
      <Footer />
      <ToastContainer/>
    </>
  )
}

export default App
