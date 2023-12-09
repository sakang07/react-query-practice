import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import {fetchEvents} from "../../util/http.js";

export default function NewEventsSection() {
  // useQuery는 쿼리를 수행하고, 쿼리의 상태를 추적하고, 캐시를 관리하는 React 커스텀 훅이다.
  // data, isPending, isError 등의 상태를 반환한다.

  // data는 쿼리가 성공적으로 완료되면 반환되는 데이터이다.
  // isPending는 쿼리 진행 여부를 나타내며, 쿼리가 진행 중이면 true를 반환한다.
  // isError는 쿼리가 실패하면 true를 반환한다.
  // error는 쿼리가 실패하면 에러를 반환하는 코드가 있는 경우 발생한 에러에 대한 정보를 반환한다.

  const { data, isPending, isError, error } = useQuery({
    // 모든 HTTP 요청은 queryKey를 통해 고유하게 식별되어 캐시를 생성한다. 이로써 같은 요청이 여러 번 발생해도 캐시를 공유할 수 있다.
    // queryKey는 배열이며, 첫 번째 요소는 쿼리의 이름이다.
    queryKey: ['events' ],
    // queryFn은 Promise를 반환하는 함수이기만 하면 된다. Axios 등을 사용해도 무방.
    queryFn: fetchEvents,
    // staleTime은 이미 캐시된 데이터가 있을 때 새로운 요청을 전송하기 전까지 기다리는 시간(기본값은 0, 단위는 ms).
    staleTime: 5000, // 5초가 지나면 새로운 요청을 보낸다.
    // garbageCollectionTime은 캐시 만료까지 대기하는 시간이며 gcTime이 지나면 캐시는 폐기된다(기본값은 5분).
    // gcTime: 30000 // 30초 동안 캐시를 유지한다.
  })

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || 'Failed to fetch events.'}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
