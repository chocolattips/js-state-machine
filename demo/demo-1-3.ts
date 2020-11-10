import useFSM from "../src";
import { IState } from "../src/FSMInterface";

function useStateApple() {
  return <IState>{
    name: "apple",
    onEnter(param) {
      param.context.to("banana");
    },
  };
}

function useStateBanana() {
  return <IState>{
    name: "banana",
    onEnter(param) {
      param.context.to("cherry");
    },
  };
}

function useStateCherry() {
  return <IState>{
    name: "cherry",
    onEnter(param) {
      param.context.finish();
    },
  };
}

useFSM()
  .putStates([useStateApple(), useStateBanana(), useStateCherry()])
  .putTransitions([
    { from: "apple", to: "banana" },
    { from: "banana", to: "cherry" },
  ])
  .on("enter", (param) => {
    console.log(`[ENTER] : ${param.state.name}`);
  })
  .on("exit", (param) => {
    console.log(`[EXIT] : ${param.state.name}`);
  })
  .entry("apple");
