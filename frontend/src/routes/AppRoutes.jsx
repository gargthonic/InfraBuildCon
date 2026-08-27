import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import ProtectedRoute from "../components/admin/ProtectedRoute.jsx";

import Home from "./../pages/Home.jsx";
import Projects from "./../pages/Projects.jsx";
import ProjectDetails from "./../pages/ProjectDetails.jsx";
import About from "./../pages/About.jsx";
import Services from "./../pages/Services.jsx";
import Contact from "./../pages/Contact.jsx";

import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProjectForm from "../pages/admin/AdminProjectForm.jsx";
import AdminContent from "../pages/admin/AdminContent.jsx";
import AdminLeads from "../pages/admin/AdminLeads.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/new" element={<AdminProjectForm />} />
            <Route path="/admin/edit/:id" element={<AdminProjectForm />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
