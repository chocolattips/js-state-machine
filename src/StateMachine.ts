import useStateMachineBuilder from "./FSMBuilder";

export type KeyValueType<T> = { [key: string]: T };

export interface IState {
  name: string;
  onEnter?(param: IEnterExitParam, variable: ISharedVariable): void;
  onUpdate?: UpdateHandlerType;
  onUpdateMethods?: { [key: string]: UpdateHandlerType };
  onExit?(param: IEnterExitParam, variable: ISharedVariable): void;
}

export interface ITransition {
  from: string;
  to: string;
}

export interface IEnterExitParam {
  state: IState;
  transition: ITransition;
}

export interface IUpdateParam {
  state: IState;
  key: string;
  value?: any;
}

export interface ISharedVariable {
  local: KeyValueType<any>;
  global: KeyValueType<any>;
}

export type EnterExitHandlerType = (
  param: IEnterExitParam,
  variable: ISharedVariable
) => void;

export type UpdateHandlerType = (
  param: IUpdateParam,
  variable: ISharedVariable
) => void;

interface EventHandlerNameMap {
  enter: EnterExitHandlerType;
  exit: EnterExitHandlerType;
  update: UpdateHandlerType;
  end: Function;
}

type DefaultType = ReturnType<typeof _default>;

export default function _default() {
  const _state = {
    headStateName: "",
    isFinished: false,
    currentState: null as IState | null,
    states: {} as KeyValueType<IState>,
    transitions: {} as KeyValueType<ITransition[]>,
    handler: {
      enterExits: {} as KeyValueType<EnterExitHandlerType>,
      updates: {} as KeyValueType<UpdateHandlerType>,
      events: {} as KeyValueType<Function>,
    },
    sharedVariable: { local: {}, global: {} } as ISharedVariable,
  };

  const _builder = useStateMachineBuilder(_state.states, _state.transitions);

  function updateData(key: string, value?: any) {
    const c = _state.currentState;
    if (c) {
      _executeUpdateHandler(
        "update",
        { state: c, key, value },
        _state.sharedVariable
      );

      if (c.onUpdateMethods) {
        const h = c.onUpdateMethods[key];
        if (h) {
          h({ state: c, key, value }, _state.sharedVariable);
        }
      }
      if (c.onUpdate) {
        c.onUpdate({ state: c, key, value }, _state.sharedVariable);
      }
    }
    return self;
  }

  function enter<T>(stateName: string, param?: T): DefaultType {
    _state.headStateName = stateName;
    _state.isFinished = false;
    _enter({ from: "", to: stateName }, param);
    return self;
  }

  function _enter(transition: ITransition, param: any) {
    const shared = _state.sharedVariable;

    const pre = _state.currentState;
    if (pre) {
      if (pre.onExit) {
        pre.onExit({ state: pre, transition }, shared);
      }
      _executeEnterExitHandler("exit", { state: pre, transition }, shared);
    }

    const next = _state.states[transition.to] || null;
    _state.currentState = next;

    if (next) {
      if (transition.to == _state.headStateName) {
        _executeEventHandler("head");
      }

      if (_state.isFinished) {
        return;
      }

      shared.local = {};

      _executeEnterExitHandler("enter", { state: next, transition }, shared);
      if (next.onEnter) {
        next.onEnter({ state: next, transition }, shared);
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

  function on<K extends keyof EventHandlerNameMap>(
    eventName: K,
    handler: EventHandlerNameMap[K]
  ): DefaultType {
    if (eventName == "enter" || eventName == "exit") {
      _state.handler.enterExits[eventName] = handler as EnterExitHandlerType;
    } else if (eventName == "update") {
      _state.handler.updates[eventName] = handler as UpdateHandlerType;
    } else {
      _state.handler.events[eventName] = handler;
    }
    return self;
  }

  function _executeEventHandler(eventName: string) {
    const h = _state.handler.events[eventName];
    if (h) {
      h();
    }
  }

  function _executeEnterExitHandler(
    eventName: string,
    param: IEnterExitParam,
    variable: ISharedVariable
  ) {
    const h = _state.handler.enterExits[eventName];
    if (h) {
      h(param, variable);
    }
  }

  function _executeUpdateHandler(
    eventName: string,
    param: IUpdateParam,
    variable: ISharedVariable
  ) {
    const h = _state.handler.updates[eventName];
    if (h) {
      h(param, variable);
    }
  }

  function finish() {
    _state.isFinished = true;
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
    finish,
  };

  return self;
}
