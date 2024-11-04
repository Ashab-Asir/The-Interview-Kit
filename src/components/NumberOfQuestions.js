import { type } from "@testing-library/user-event/dist/type";
import React from "react";

export default function NumberOfQuestions({ dispatch }) {
  return (
    <div>
      <button onClick={() => dispatch({ type: "dataReceived", payload: 5 })}>
        5
      </button>
    </div>
  );
}
