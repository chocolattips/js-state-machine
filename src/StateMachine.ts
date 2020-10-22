import useStateMachineBuilder from "./StateMachineBuilder";

export type KeyValueType<T> = { [key: string]: T };

export interface IUpdateParam {
  key: string;
  data?: any;
}

export interface IState {
  name: string;
  onEnter?(transition: ITransition, param?: any): void;
  onUpdate?(param: IUpdateParam): void;
  onExit?(transition: ITransition): void;
}

export interface ITransition {
  from: string;
  to: string;
}

export interface IEnterExitParam {
  state: IState;
  transition: ITransition;
}

export type EnterExitHandlerType = (param: IEnterExitParam) => void;

type DefaultType = ReturnType<typeof _default>;

export default function _default() {
  const _state = {
    currentState: null as IState | null,
    states: {} as KeyValueType<IState>,
    transitions: {} as KeyValueType<ITransition[]>,
    enterExitHandlers: {} as KeyValueType<EnterExitHandlerType>,
  };

  const _builder = useStateMachineBuilder(_state.states, _state.transitions);

  function updateData(param: IUpdateParam) {
    const c = _state.currentState;
    if (c && c.onUpdate) {
      c.onUpdate(param);
    }
    return self;
  }

  function enter<T>(stateName: string, param?: T): DefaultType {
    _enter({ from: "", to: stateName }, param);
    return self;
  }

  function _enter(transition: ITransition, param: any) {
    const pre = _state.currentState;
    if (pre) {
      if (pre.onExit) {
        pre.onExit(transition);
      }
      _executeEnterExitHandler("exit", { state: pre, transition });
    }

    const next = _state.states[transition.to] || null;
    _state.currentState = next;

    if (next) {
      _executeEnterExitHandler("enter", { state: next, transition });
      if (next.onEnter) {
        next.onEnter(transition, param || {});
      }
    }
  }

  function to(stateName: string, param?: any): DefaultType {
    if (_state.currentState) {
      const ts = _state.transitions[_state.currentState.name];
      if (ts) {
        const index = ts.findIndex((x) => x.to == stateName);
        if (index != -1) {
          const t = ts[index];
          _enter(t, param);
        }
      }
    }
    return self;
  }

  function on(eventName: string, handler: EnterExitHandlerType): DefaultType {
    if (eventName == "enter" || eventName == "exit") {
      _state.enterExitHandlers[eventName] = handler;
    }
    return self;
  }

  function _executeEnterExitHandler(eventName: string, param: IEnterExitParam) {
    const h = _state.enterExitHandlers[eventName];
    if (h) {
      h(param);
    }
  }

  const self = {
    putStates(x: IState[]) {
      _builder.putStates(x);
      return self;
    },
    putState(x: IState) {
      _builder.putState(x);
      return self;
    },
    putTransitions(x: ITransition[]) {
      _builder.putTransitions(x);
      return self;
    },
    putTransition(x: ITransition) {
      _builder.putTransition(x);
      return self;
    },
    updateData,
    enter,
    to,
    on,
  };

  return self;
}
