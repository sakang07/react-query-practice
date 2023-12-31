import {QueryClient} from "@tanstack/react-query";
// queryClient는 쿼리를 관리하는 인스턴스이다. new QueryClient()로 생성한다.

export const queryClient = new QueryClient();

// fetch 함수에서 매개변수로 받는 값은 객체이다.
// signal은 AbortController 객체의 signal 프로퍼티이다. 요청이 중단될 때 그 신호를 받는다.
// 두 번째 인자는 호출부에서 넘긴 검색어를 받는다.
export async function fetchEvents({ signal, searchTerm }) {
  console.log(searchTerm)
  let url = 'http://localhost:3000/events';

  if (searchTerm) {
    // 검색을 할 경우 searchTerm을 파라미터로 받아서 url에 추가한다.
    url += '?search=' + searchTerm;
  }
  // signal을 객체 형태로 fetch의 두 번째 프로퍼티로 전달하면
  // 사용자가 다른 페이지로 전환하는 등 요청을 취소하는 동작을 했을 때 HTTP 요청도 취소된다.
  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchSelectableImages({ signal }) {
  const response = await fetch(`http://localhost:3000/events/images`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the images');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}