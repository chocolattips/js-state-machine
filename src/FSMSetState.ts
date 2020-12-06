import { FSMCallbackType } from "./FSMCallback";
import { FSMVariableType } from "./FSMVariable";
import {
  IState,
  ITransition,
  IStateContext,
  IRootContext,
} from "./FSMInterface";
import useFSMStateContext from "./FSMStateContext";

interface IModel {
  currentState: IState | null;
  currentContext: IStateContext | null;
}

export type FSMSetStateType = ReturnType<typeof _default>;

export default function _default(
  model: IModel,
  rootContext: IRootContext,
  callback: FSMCallbackType,
  variable: FSMVariableType
) {
  function enter(next: IState, argument: any, transition: ITransition) {
    model.currentState = next;
    const context = useFSMStateContext(next, rootContext);
    model.currentContext = context;
    variable.clearLocalData();

    callback.executeEnter(
      { state: next, transition, context, argument },
      variable.getVariable(next.name)
    );
  }

  function exit(transition: ITransition) {
    const pre = model.currentState;
    const context = model.currentContext;
    if (pre && context) {
      callback.executeExit(
        { state: pre, transition, context },
        variable.getVariable(pre.name)
      );
    }
    model.currentState = null;
    model.currentContext = null;
  }

  return {
    enter,
    exit,
  };
}
