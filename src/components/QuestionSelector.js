import React from "react";

export default function QuestionSelector({ dispatch }) {
  return (
    <div className="question-selector">
      <h2>Choose the number of questions</h2>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "setNumQuestions", payload: 5 })}
      >
        5 Questions
      </button>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "setNumQuestions", payload: 10 })}
      >
        10 Questions
      </button>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "setNumQuestions", payload: 15 })}
      >
        15 Questions
      </button>
    </div>
  );
}
