import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import { status } from "./../../node_modules/@tinyhttp/send/dist/status";
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        point:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
      };
    default:
      throw new Error("Action unkonw");
  }
}
export default function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;
  const maxPoint = questions.reduce((prev, curr) => prev + curr.points, 0);
  console.log(maxPoint);
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header></Header>
      <Main>
        {status === "loading" && <Loader></Loader>}
        {status === "error" && <Error></Error>}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
          ></StartScreen>
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestions}
              points={points}
              maxPoint={maxPoint}
              answer={answer}
            ></Progress>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            ></Question>
            <NextButton
              answer={answer}
              numQuestions={numQuestions}
              index={index}
              dispatch={dispatch}
            ></NextButton>
          </>
        )}
        {status === "finished" && (
          <FinishScreen points={points} maxPoint={maxPoint}></FinishScreen>
        )}
      </Main>
    </div>
  );
}
