import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Button, DatePicker } from 'antd';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './components/DashBoard';
import Header from './components/ui/Header';
import Footer from './components/Footer';
import UserDashBoard from './pages/UserDashBoard';
import HomePage from './components/HomePage';
import Home from './pages/Home';
import UserDetails from './components/Trash';
import AddProblem from './components/admin/AddProblem';
import Problem from './components/Problem';
import Editor from './components/Editor';
import EditProblem from './components/EditProblem';
import ProblemEditor from './pages/ProblemEditor';
import AllProblemsPage from './pages/AllProbelmsPage';
import AllProblems from './components/AllProblems';
import AdminAll from './components/admin/AdminAll';
import AdminUpdate from './components/admin/AdminUpdate'
import Referral from './components/Referral';
import ReferralPage from './pages/ReferralPage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/user/signup/:referral_id?" element={<Signup />} />
        <Route path="/user/login" element={<Login/>} />
        <Route path="/user/DashBoard" element={<UserDashBoard/>} />
        <Route path="/" element={<Dashboard/>} />
        <Route path="/head" element={<Header/>} />
        <Route path="/f" element={<Footer/>} />
        <Route path="/h" element={<HomePage/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/details" element={<UserDetails/>} />
        <Route path="/admin/addproblem" element={<AddProblem/>} />
        {/* <Route path="/user/problem/:problemId" element={<Problem/>} /> */}
        <Route path="/user/editor" element={<Editor/>} />
        {/* <Route path="/user/problemeditor/:problemId" element={<EditProblem/>} /> */}
        <Route path="/user/problemeditor/:problemId" element={<ProblemEditor/>} />
        <Route path="/user/problems" element={<AllProblemsPage/>} />
        <Route path="/admin/all" element={<AdminAll/>} />
        <Route path="/admin/update/:problemId" element={<AdminUpdate/>} />
        <Route path="/user/referral" element={<ReferralPage/>} />
    </Routes>
    </>
  )
}

export default App
