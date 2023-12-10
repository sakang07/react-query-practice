import {useRef, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {fetchEvents} from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState()

  // isLoading은 쿼리의 실행 여부를 나타내고,
  // isPending은 쿼리 실행 여부와 관계없이 쿼리가 캐시를 사용하고 있는지 여부를 나타낸다.
  // isPending은 enabled가 false인 경우에도 true를 반환한다.
  // -> 최초 쿼리가 아직 실행되지 않고 있어도 로딩 스피너를 반환하는 오작동이 생김에 주의.
  const {data, isLoading, isError, error} = useQuery({
    // queryKey에 동적인 값을 전달하여 같은 쿼리로 다른 데이터를 캐싱하거나 재사용할 수 있다.
    queryKey: ['events', {search: searchTerm}],
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }), // submit시의 검색어를 url로 전달
    // enabled가 false이면 쿼리가 실행되지 않는다. 기본값은 true.
    enabled: searchTerm !== undefined, // 검색어가 없으면 쿼리를 실행하지 않는다.
  });

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator/>;
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
            <EventItem event={event}/>
          </li>
        ))}
      </ul>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    // 리렌더를 일으키지 않는 ref의 값을 submit 이벤트 발생시 핸들러로 가져와 state를 업데이트.
    setSearchTerm(searchElement.current.value);
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
