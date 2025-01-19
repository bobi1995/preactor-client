import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import NavBar from "../components/general/NavBar";
import Home from "../page/Home";
import Resource from "../page/Resource";
import Shift from "../page/Shift";
import ResourcePage from "../page/ResourcePage";
import ShiftPage from "../page/ShiftPage";
import SchedulePage from "../page/SchedulePage";
import Schedule from "../page/Schedule";

const AppLayout = () => {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="m-auto mt-5 w-full">
        <Outlet />
      </div>
    </div>
  );
};

const mainRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/resource",
        element: <Resource />,
      },
      {
        path: "/resource/:id",
        element: <ResourcePage />,
      },
      {
        path: "/shift",
        element: <Shift />,
      },
      {
        path: "/shift/:id",
        element: <ShiftPage />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/schedule/:id",
        element: <SchedulePage />,
      },
    ],
  },
]);

const router = () => <RouterProvider router={mainRouter} />;

export default router;
