import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import NavBar from "../components/general/NavBar";
import Home from "../page/Home";
import Resource from "../page/ResourcesPage";
import Shift from "../page/ShiftsPage";
import ResourcePage from "../page/ResourcePage";
import ShiftPage from "../page/ShiftPage";
import SchedulePage from "../page/SchedulePage";
import SchedulesPage from "../page/SchedulesPage";
import GroupsPage from "../page/GroupsPage";
import LNOrders from "../page/LNOrders";
import BreaksPage from "../page/BreaksPage";

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
        element: <SchedulesPage />,
      },
      {
        path: "/schedule/:id",
        element: <SchedulePage />,
      },
      {
        path: "/ln-orders",
        element: <LNOrders />,
      },
      {
        path: "/group",
        element: <GroupsPage />,
      },
      {
        path: "/breaks",
        element: <BreaksPage />,
      },
    ],
  },
]);

const router = () => <RouterProvider router={mainRouter} />;

export default router;
