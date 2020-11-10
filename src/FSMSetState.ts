import { FSMCallbackType } from "./FSMCallback";
import { FSMVariableType } from "./FSMVariable";
import {
  IState,
  ITransition,
  ISharedVariable,
  IStateContext,
} from "./FSMInterface";

interface IModel {
  currentState: IState | null;
  readonly sharedVariable: ISharedVariable;
}

export type FSMSetStateType = ReturnType<typeof _default>;

export default function _default(
  model: IModel,
  callback: FSMCallbackType,
  variable: FSMVariableType
) {
  function enter(
    next: IState,
    argument: any,
    transition: ITransition,
    context: IStateContext
  ) {
    model.currentState = next;
    variable.clearLocalData();

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

  return {
    enter,
    exit,
  };
}
