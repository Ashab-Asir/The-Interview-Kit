import React from "react";

export default function FinishScreen({ points, maxPoint, dispatch }) {
  const percentage = (points / maxPoint) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points} </strong> out of
        {maxPoint} ({Math.ceil(percentage)}%)
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Reset
      </button>
    </>
  );
}
