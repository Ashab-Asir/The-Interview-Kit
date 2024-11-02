import React from "react";
import Options from "./Options";

export default function Question({ question, dispatch, answer }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        answer={answer}
        question={question}
        dispatch={dispatch}
      ></Options>
    </div>
  );
}
