import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="h-screen w-screen bg-pink-200 text-center flex flex-col items-center p-4">
      <Link to={"/"}>
        <h1 className="text-4xl font-bold">AInime</h1>
      </Link>
      <Outlet />
    </div>
  );
}

export default Layout;
