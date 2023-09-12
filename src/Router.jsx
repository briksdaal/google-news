import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routesConfig from './routesConfig';

const Router = () => {
  const router = createBrowserRouter(routesConfig);

  return <RouterProvider router={router} />;
};

export default Router;
