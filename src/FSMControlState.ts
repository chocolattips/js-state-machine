import { FSMCallbackType } from "./FSMCallback";
import { FSMSetStateType } from "./FSMSetState";
import { FSMVariableType } from "./FSMVariable";
import {
  ITransition,
  IState,
  IStateContext,
  KeyValueType,
} from "./FSMInterface";

interface IModel {
  readonly currentState: IState | null;
  readonly currentContext: IStateContext | null;
  readonly states: KeyValueType<IState>;
  readonly transitions: KeyValueType<ITransition[]>;
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
  setState: FSMSetStateType,
  callback: FSMCallbackType,
  variable: FSMVariableType,
  state?: DefaultStateType
) {
  const _state = state || useDefaultState();

  async function entry(stateName: string, argument?: any) {
    if (!_state.headStateName) {
      setHead(stateName);
    }
    _state.isFinished = false;
    _state.isEnded = false;
    await changeState({ from: "", to: stateName }, argument);
  }

  function setHead(stateName: string) {
    _state.headStateName = stateName;
  }

  function isHead(stateName: string) {
    return stateName && _state.headStateName == stateName;
  }

  function changeState(transition: ITransition, argument: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setState.exit(transition);

        const next = model.states[transition.to] || null;
        if (next) {
          if (transition.to == _state.headStateName) {
            const shared = variable.getVariable(next.name);
            callback.executeEvent("head", { eventName: "head" }, shared);
            if (_state.isFinished) {
              end();
              resolve();
              return;
            }
          }

          setState.enter(next, argument, transition);
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
      return true;
    }

    return false;
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
    callback.executeEvent(
      "end",
      { eventName: "end" },
      variable.getVariable("")
    );
  }

  return {
    entry,
    setHead,
    isHead,
    changeState,
    to,
    findTransition,
    finish,
    end,
  };
}
