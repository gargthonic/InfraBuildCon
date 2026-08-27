import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToUp.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import FloatingContact from "../components/FloatingContact.jsx";

export default function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
      <FloatingContact />
    </>
  );
}
