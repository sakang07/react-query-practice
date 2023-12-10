import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/http.js';
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();

  // useMutation은 useQuery와는 달리 서버에 데이터를 보내는 과정에 관여한다.
  // useMutation은 mutationFn을 통해 서버에 데이터를 보내는 함수를 전달받으며,
  // useQuery처럼 컴포넌트가 실행되자마자 쿼리를 실행하지 않고 사용자가 원하는 타이밍에 실행한다.
  // useQuery와 마찬가지로 data, isPending, isError, error 등의 상태를 반환한다.
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
  });
  function handleSubmit(formData) {
    // 원하는 타이밍에 mutate를 호출하여 서버에 데이터를 보낸다.
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
          )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create events"
          message={
            error.info?.message ||
            'Failed to create event. Please try again later.'
          }
        />
      )}
    </Modal>
  );
}
