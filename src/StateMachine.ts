import useStateMachineBuilder from "./StateMachineBuilder";

export type KeyValueType<T> = { [key: string]: T };

export interface IUpdateParam {
  key: string;
  value?: any;
}

export interface IState {
  name: string;
  onEnter?(param: IEnterExitParam, data?: any): void;
  onUpdate?(state: IState, param: IUpdateParam): void;
  onExit?(param: IEnterExitParam): void;
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
    headStateName: "",
    currentState: null as IState | null,
    states: {} as KeyValueType<IState>,
    transitions: {} as KeyValueType<ITransition[]>,
    enterExitHandlers: {} as KeyValueType<EnterExitHandlerType>,
    eventHandlers: {} as KeyValueType<Function>,
  };

  const _builder = useStateMachineBuilder(_state.states, _state.transitions);

  function updateData(param: IUpdateParam) {
    const c = _state.currentState;
    if (c && c.onUpdate) {
      c.onUpdate(c, param);
    }
    return self;
  }

  function enter<T>(stateName: string, param?: T): DefaultType {
    _state.headStateName = stateName;
    _enter({ from: "", to: stateName }, param);
    return self;
  }

  function _enter(transition: ITransition, param: any) {
    const pre = _state.currentState;
    if (pre) {
      if (pre.onExit) {
        pre.onExit({ state: pre, transition });
      }
      _executeEnterExitHandler("exit", { state: pre, transition });
    }

    const next = _state.states[transition.to] || null;
    _state.currentState = next;

    if (next) {
      if (transition.to == _state.headStateName) {
        _executeEventHandler("head");
      }

      _executeEnterExitHandler("enter", { state: next, transition });
      if (next.onEnter) {
        next.onEnter({ state: next, transition }, param || {});
      }
    }
  }

  function to(stateName: string, param?: any, current?: IState): DefaultType {
    if (!_state.currentState) {
      return self;
    }

    if (current && current.name != _state.currentState.name) {
      return self;
    }

    const ts = _state.transitions[_state.currentState.name];
    if (!ts) {
      return self;
    }

    const index = ts.findIndex((x) => x.to == stateName);
    if (index != -1) {
      const t = ts[index];
      _enter(t, param);
    }
    return self;
  }

  function on(
    eventName: string,
    handler: EnterExitHandlerType | Function
  ): DefaultType {
    if (eventName == "enter" || eventName == "exit") {
      _state.enterExitHandlers[eventName] = handler as EnterExitHandlerType;
    } else {
      _state.eventHandlers[eventName] = handler;
    }
    return self;
  }

  function _executeEventHandler(eventName: string) {
    const h = _state.eventHandlers[eventName];
    if (h) {
      h();
    }
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
    putSequences(x: IState[]) {
      _builder.putSequences(x);
      return self;
    },
    updateData,
    enter,
    to,
    on,
  };

  return self;
}
