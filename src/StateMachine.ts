export interface IState {
  name: string;
  onEnter?(transition: ITransition, param?: any): void;
  onExit?(transition: ITransition): void;
}

export interface ITransition {
  from: string;
  to: string;
}

type DefaultType = ReturnType<typeof _default>;

export default function _default() {
  const _state = {
    currentState: null as IState | null,
    states: {} as { [key: string]: IState },
    transitions: {} as { [key: string]: ITransition[] },
    handlers: {} as { [key: string]: Function },
  };

  function putStates(states: IState[]): DefaultType {
    for (const o of states) {
      putState(o);
    }
    return self;
  }

  function putState(state: IState): DefaultType {
    _state.states[state.name] = state;
    return self;
  }

  function putTransitions(transitions: ITransition[]): DefaultType {
    for (const o of transitions) {
      putTransition(o);
    }
    return self;
  }

  function putTransition(transition: ITransition): DefaultType {
    const ts = _state.transitions[transition.from] || [];
    const index = ts.findIndex((x) => x.to == transition.to);
    if (index == -1) {
      ts.push(transition);
    } else {
      ts[index] = transition;
    }
    _state.transitions[transition.from] = ts;
    return self;
  }

  function enter<T>(stateName: string, param?: T) {
    _enter({ from: "", to: stateName }, param);
    return self;
  }

  function _enter(transition: ITransition, param: any) {
    const pre = _state.currentState;
    if (pre) {
      if (pre.onExit) {
        pre.onExit(transition);
      }
      _executeEventHandler("exit", { state: pre, transition });
    }
    const next = _state.states[transition.to] || null;
    if (next) {
      _executeEventHandler("enter", { state: next, transition });
      if (next.onEnter) {
        next.onEnter(transition, param || {});
      }
    }
    _state.currentState = next;
  }

  function to(stateName: string, param?: any) {
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

  function on(eventName: string, handler: Function) {
    _state.handlers[eventName] = handler;
    return self;
  }

  function _executeEventHandler(eventName: string, param: any) {
    const h = _state.handlers[eventName];
    if (h) {
      h(param);
    }
  }

  const self = {
    putStates,
    putState,
    putTransitions,
    putTransition,
    enter,
    to,
    on,
  };

  return self;
}
