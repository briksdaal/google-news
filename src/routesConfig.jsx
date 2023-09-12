import FetchNews from './components/FetchNews';
import ErrorPage from './components/ErrorPage';
import App from './App';

const routesConfig = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        children: [
          { index: true, element: <FetchNews /> },
          {
            path: 'topics/:topicId',
            element: <FetchNews />
          },
          {
            path: '*',
            element: <ErrorPage />
          }
        ]
      }
    ]
  }
];

export default routesConfig;
