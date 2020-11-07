import { FSMCallbackType } from "./FSMCallback";
import { FSMSetStateType } from "./FSMSetState";
import {
  ITransition,
  ISharedVariable,
  IState,
  IStateContext,
  KeyValueType,
} from "./FSMInterface";

interface IModel {
  headStateName: string;
  isFinished: boolean;
  isEnded: boolean;

  currentState: IState | null;
  states: KeyValueType<IState>;
  transitions: KeyValueType<ITransition[]>;

  sharedVariable: ISharedVariable;
}

export default function (
  model: IModel,
  context: IStateContext,
  setState: FSMSetStateType,
  callback: FSMCallbackType
) {
  async function entry(stateName: string, argument?: any) {
    model.headStateName = stateName;
    model.isFinished = false;
    model.isEnded = false;
    await changeState({ from: "", to: stateName }, argument);
  }

  function changeState(transition: ITransition, argument: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shared = model.sharedVariable;

        setState.exit(transition, context);

        const next = model.states[transition.to] || null;
        if (next) {
          if (transition.to == model.headStateName) {
            callback.executeEvent("head", { eventName: "head" }, shared);
            if (model.isFinished) {
              end();
              resolve();
              return;
            }
          }

          setState.enter(next, argument, transition, context);
        } else {
          end();
        }

        resolve();
      }, 0);
    });
  }

  async function to(stateName: string, argument?: any, current?: IState) {
    if (!model.currentState) {
      return;
    }

    if (current && current.name != model.currentState.name) {
      return;
    }

    const ts = model.transitions[model.currentState.name];
    if (!ts) {
      return;
    }

    const index = ts.findIndex((x) => x.to == stateName);
    if (index != -1) {
      const t = ts[index];
      await changeState(t, argument);
    }
  }

  async function finish() {
    model.isFinished = true;
    if (model.currentState) {
      await changeState({ from: model.currentState.name, to: "" }, null);
    } else {
      end();
    }
  }

  function end() {
    if (model.isEnded) {
      return;
    }

    model.isEnded = true;
    callback.executeEvent("end", { eventName: "end" }, model.sharedVariable);
  }

  return {
    entry,
    changeState,
    to,
    finish,
    end,
  };
}
