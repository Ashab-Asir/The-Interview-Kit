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
import Footer from "./Footer";
import Timer from "./Timer";
import QuestionSelectionScreen from "./QuestionSelectionScreen ";
import QuestionSelector from "./QuestionSelector";
const data = [
  {
    question:
      "What is the primary purpose of version control systems like Git?",
    options: [
      "To track changes and collaborate on code",
      "To write code faster",
      "To optimize code performance",
      "To deploy code to production",
    ],
    correctOption: 0,
    points: 10,
  },
  {
    question:
      "Which data structure uses a LIFO (Last In, First Out) principle?",
    options: ["Queue", "Array", "Stack", "Linked List"],
    correctOption: 2,
    points: 10,
  },
  {
    question: "What does 'DRY' stand for in programming?",
    options: [
      "Don't Repeat Yourself",
      "Do Repeat Yourself",
      "Documentation Requirements Yearly",
      "Don't Require Yourself",
    ],
    correctOption: 0,
    points: 10,
  },
  {
    question: "Which of the following is NOT a primary programming paradigm?",
    options: ["Object-oriented", "Functional", "Procedural", "Network-based"],
    correctOption: 3,
    points: 10,
  },
  {
    question: "What is the purpose of a function or method in programming?",
    options: [
      "To execute code conditionally",
      "To structure code in reusable units",
      "To compile the code",
      "To manage memory usage",
    ],
    correctOption: 1,
    points: 10,
  },
  {
    question: "What is 'Big O' notation used for?",
    options: [
      "To describe the speed of the internet connection",
      "To measure the runtime or space efficiency of an algorithm",
      "To indicate the version of a software",
      "To compile code faster",
    ],
    correctOption: 1,
    points: 20,
  },
  {
    question: "Which HTTP method is used to request data from a server?",
    options: ["POST", "GET", "PUT", "DELETE"],
    correctOption: 1,
    points: 10,
  },
  {
    question: "What is the primary difference between SQL and NoSQL databases?",
    options: [
      "SQL is open-source; NoSQL is not",
      "SQL is used for web apps, NoSQL for mobile apps",
      "SQL databases are relational; NoSQL databases are non-relational",
      "SQL is faster than NoSQL",
    ],
    correctOption: 2,
    points: 20,
  },
  {
    question: "What does the acronym 'API' stand for?",
    options: [
      "Application Programming Interface",
      "Automatic Program Installation",
      "Application Process Initialization",
      "Algorithm Protocol Interface",
    ],
    correctOption: 0,
    points: 10,
  },
  {
    question:
      "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort"],
    correctOption: 2,
    points: 30,
  },
  {
    question:
      "Which programming language is primarily used for web development?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctOption: 2,
    points: 10,
  },
  {
    question: "What does a '404 Not Found' error indicate?",
    options: [
      "The server is down",
      "The client made a syntax error in the request",
      "The requested resource could not be found",
      "The server is overloaded",
    ],
    correctOption: 2,
    points: 10,
  },
  {
    question: "What does the 'this' keyword refer to in JavaScript?",
    options: [
      "The window object",
      "The function's global context",
      "The current object in which the function is being called",
      "The document object",
    ],
    correctOption: 2,
    points: 20,
  },
  {
    question:
      "Which type of testing ensures each unit of code performs as expected?",
    options: [
      "Integration testing",
      "End-to-end testing",
      "Unit testing",
      "System testing",
    ],
    correctOption: 2,
    points: 20,
  },
  {
    question:
      "Which of the following is an example of a framework for frontend development?",
    options: ["Django", "Flask", "Spring", "React"],
    correctOption: 3,
    points: 10,
  },
];

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "selecting",
  index: 0,
  answer: null,
  points: 0,
  timeRemaining: null,
  selectedNumQuestions: null, // New state property
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "selecting",
      };
    case "setNumQuestions":
      const selectedQuestions = state.questions.slice(0, action.payload);
      return {
        ...state,
        questions: selectedQuestions,
        selectedNumQuestions: action.payload,
        status: "ready",
      };
    case "start":
      return {
        ...state,
        status: "active",
        timeRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
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
    case "tick":
      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
        status: state.timeRemaining === 0 ? "finished" : state.status,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
      };
    case "restart":
      return {
        ...initialState,
        questions: data,
        status: "selecting",
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      timeRemaining,
      selectedNumQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    // Load data on mount
    dispatch({ type: "dataReceived", payload: data });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "selecting" && <QuestionSelector dispatch={dispatch} />}
        {status === "ready" && (
          <StartScreen numQuestions={questions.length} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={questions.length}
              points={points}
              maxPoint={questions.reduce((p, q) => p + q.points, 0)}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer timeRemaining={timeRemaining} dispatch={dispatch} />
              <NextButton
                answer={answer}
                numQuestions={questions.length}
                index={index}
                dispatch={dispatch}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoint={questions.reduce((p, q) => p + q.points, 0)}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
