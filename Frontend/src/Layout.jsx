import React from "react";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div className="m-0 p-0">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default Layout;
