import React from "react";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div className="m-0 p-0">
        <div
          className="min-h-screen bg-cover bg-center"
          style={{
            backgroundColor: "#f0f0f0",
          }}
        >
          <Header />
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Layout;
