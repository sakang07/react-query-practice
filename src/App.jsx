import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import Events from './components/Events/Events.jsx';
import EventDetails from './components/Events/EventDetails.jsx';
import NewEvent from './components/Events/NewEvent.jsx';
import EditEvent from './components/Events/EditEvent.jsx';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/http.js"; // queryClient를 이용하기 위해 http.js로 옮기고 import

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/events" />,
  },
  {
    path: '/events',
    element: <Events />,

    children: [
      {
        path: '/events/new',
        element: <NewEvent />,
      },
    ],
  },
  {
    path: '/events/:id',
    element: <EventDetails />,
    children: [
      {
        path: '/events/:id/edit',
        element: <EditEvent />,
      },
    ],
  },
]);


function App() {
  return (
    // QueryClientProvider는 React Query의 캐시를 관리하는 컴포넌트이다.
    // Router를 QueryClientProvider로 감싸면, Router 내부의 모든 컴포넌트에서 React Query를 사용할 수 있다.
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    );
}

export default App;
