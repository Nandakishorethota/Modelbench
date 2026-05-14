import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
 
export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <Outlet />
    </div>
  );
}