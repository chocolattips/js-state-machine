import useFSM from "../src";
import { IState } from "../src/FSMInterface";

function useStateApple() {
  return <IState>{
    name: "apple",
    onUpdateMethods: {
      next(param) {
        param.context.to("banana");
      },
    },
  };
}

function useStateBanana() {
  return <IState>{
    name: "banana",
    onUpdateMethods: {
      next(param) {
        param.context.to("cherry");
      },
    },
  };
}

function useStateCherry() {
  return <IState>{
    name: "cherry",
    onUpdateMethods: {
      next(param) {
        param.context.finish();
      },
    },
  };
}

useFSM()
  .putSequences([useStateApple(), useStateBanana(), useStateCherry()])
  .on("enter", (param) => {
    console.log(`[ENTER] : ${param.state.name}`);
    param.context.updateData("next");
  })
  .on("exit", (param) => {
    console.log(`[EXIT] : ${param.state.name}`);
  })
  .entry("apple");
