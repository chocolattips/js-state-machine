export interface IState {
  name: string;
  onEnter<T>(transition: ITransition, param?: T): void;
  onExit(transition: ITransition): void;
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
  };

  function putState(state: IState): DefaultType {
    _state.states[state.name] = state;
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
      pre.onExit(transition);
    }
    const next = _state.states[transition.to] || null;
    if (next) {
      next.onEnter(transition, param || {});
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

  const self = {
    putState,
    putTransition,
    enter,
    to,
  };

  return self;
}
