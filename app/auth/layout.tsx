import { Link, Outlet } from "react-router";


export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Auth Navigation (Optional) */}
    <nav className="w-full bg-blue-500 p-4 fixed top-0 left-0">
      <Link to="/login" className="mr-4 text-white">Login</Link>
      <Link to="/register" className="text-white">Register</Link>
    </nav>

      {/* This is where login/register pages will render */}
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <Outlet />
      </div>
    </div>
  );
}