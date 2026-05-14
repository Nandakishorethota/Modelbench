import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import favicon from "./assets/favicon.png";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Compare from "./pages/Compare";
import About from "./pages/About";

// set favicon
const link =
  document.querySelector("link[rel='icon']") ||
  document.createElement("link");

link.rel = "icon";
link.type = "image/png";
link.href = favicon;

document.head.appendChild(link);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="compare" element={<Compare />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<Navigate to="/compare" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);