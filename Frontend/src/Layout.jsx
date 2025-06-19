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
            backgroundImage:
              "url('https://res.cloudinary.com/bloghorizon/image/upload/v1750338244/1305_djwslt.jpg')",
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
