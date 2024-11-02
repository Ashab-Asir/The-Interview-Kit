import React from "react";

export default function Progress({
  numQuestion,
  index,
  points,
  maxPoint,
  answer,
}) {
  return (
    <header className="progress">
      <progress
        max={numQuestion}
        value={index + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{index + 1}</strong>/{numQuestion}
      </p>
      <p>
        <strong>{points}</strong>/{maxPoint}
      </p>
    </header>
  );
}
