import {
  IState,
  ITransition,
  ISharedVariable,
  IStateContext,
} from "./FSMInterface";
import useFSMCallback from "./FSMCallback";

type CallbackType = ReturnType<typeof useFSMCallback>;

interface IModel {
  currentState: IState | null;
  isEnded: boolean;
  sharedVariable: ISharedVariable;
}

export default function _default(model: IModel, callback: CallbackType) {
  function enter(
    next: IState,
    argument: any,
    transition: ITransition,
    context: IStateContext
  ) {
    model.currentState = next;
    model.sharedVariable.local = {};

    callback.executeEnter(
      { state: next, transition, context, argument },
      model.sharedVariable
    );
  }

  function exit(transition: ITransition, context: IStateContext) {
    const pre = model.currentState;
    if (pre) {
      callback.executeExit(
        { state: pre, transition, context },
        model.sharedVariable
      );
    }
    model.currentState = null;
  }

  function end() {
    if (model.isEnded) {
      return;
    }

    model.isEnded = true;
    callback.executeEvent("end", { eventName: "end" }, model.sharedVariable);
  }

  return {
    enter,
    exit,
    end,
  };
}
