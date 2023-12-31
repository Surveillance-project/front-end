import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./Login";
import { MapPage } from "./Map";
import { DistrictPage } from "./District";

// This is a router for you
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/map",
    element: <MapPage />,
  },
  {
    path: "/map/:cid/:district",
    element: <DistrictPage />,
  },
]);

// Starting point of your application
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
