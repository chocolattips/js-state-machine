import useFSM from "..";
import { IState } from "../FSMInterface";

function useStateApple() {
  return <IState>{
    name: "apple",
    onEnter(param) {
      param.context.emit("next", { name: "banana" });
    },
  };
}

function useStateBanana() {
  return <IState>{
    name: "banana",
    onEnter(param) {
      param.context.emit("next", { name: "cherry" });
    },
  };
}

function useStateCherry() {
  return <IState>{
    name: "cherry",
    onEnter(param) {
      param.context.emit("finish");
    },
  };
}

useFSM()
  .putSequences([useStateApple(), useStateBanana(), useStateCherry()])
  .on("enter", (param) => {
    console.log(`[ENTER] : ${param.state.name}`);
  })
  .onEmitMethods({
    next(param) {
      param.context.to(param.data.name);
    },
    finish(param) {
      param.context.finish();
    },
  })
  .on("exit", (param) => {
    console.log(`[EXIT] : ${param.state.name}`);
  })
  .entry("apple");
