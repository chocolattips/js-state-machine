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
  readonly currentState: IState | null;
  readonly states: KeyValueType<IState>;
  readonly transitions: KeyValueType<ITransition[]>;

  readonly sharedVariable: ISharedVariable;
}

export function useDefaultState() {
  return {
    headStateName: "",
    isFinished: false,
    isEnded: false,
  };
}
type DefaultStateType = ReturnType<typeof useDefaultState>;

export default function (
  model: IModel,
  context: IStateContext,
  setState: FSMSetStateType,
  callback: FSMCallbackType,
  state?: DefaultStateType
) {
  const _state = state || useDefaultState();

  async function entry(stateName: string, argument?: any) {
    _state.headStateName = stateName;
    _state.isFinished = false;
    _state.isEnded = false;
    await changeState({ from: "", to: stateName }, argument);
  }

  function changeState(transition: ITransition, argument: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shared = model.sharedVariable;

        setState.exit(transition, context);

        const next = model.states[transition.to] || null;
        if (next) {
          if (transition.to == _state.headStateName) {
            callback.executeEvent("head", { eventName: "head" }, shared);
            if (_state.isFinished) {
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
    const t = findTransition(stateName, current);
    if (null != t) {
      await changeState(t, argument);
    }
  }

  function findTransition(stateName: string, current?: IState) {
    if (!model.currentState) {
      return null;
    }

    if (current && current.name != model.currentState.name) {
      return null;
    }

    const ts = model.transitions[model.currentState.name];
    if (!ts) {
      return null;
    }

    const index = ts.findIndex((x) => x.to == stateName);
    if (index == -1) {
      return null;
    }

    return ts[index];
  }

  async function finish() {
    _state.isFinished = true;
    if (model.currentState) {
      await changeState({ from: model.currentState.name, to: "" }, null);
    } else {
      end();
    }
  }

  function end() {
    if (_state.isEnded) {
      return;
    }

    _state.isEnded = true;
    callback.executeEvent("end", { eventName: "end" }, model.sharedVariable);
  }

  return {
    entry,
    changeState,
    to,
    findTransition,
    finish,
    end,
  };
}
