import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col justify-between text-white p-2 overflow-hidden">
      <Header />
      <div className="flex gap-2 basis-full">
        <Sidebar />
        <Main />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
