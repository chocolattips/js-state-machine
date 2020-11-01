import useStateMachineBuilder from "./FSMBuilder";
import useStateMachineCallback from "./FSMCallback";

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
  fsm: DefaultType;
  state: IState;
  transition: ITransition;
}

export interface IUpdateParam {
  fsm: DefaultType;
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

export interface EventHandlerNameMap {
  head: Function;
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
    isEnded: false,
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
  const _callback = useStateMachineCallback(_state.handler);

  function updateData(key: string, value?: any, targetStateName?: string) {
    const c = _state.currentState;
    if (c && (!targetStateName || targetStateName == c.name)) {
      _callback.executeUpdate(
        { state: c, key, value, fsm: self },
        _state.sharedVariable
      );
    } else {
      console.log(`x not update data : ${key}`);
    }
    return self;
  }

  function entry<T>(stateName: string, param?: T) {
    return new Promise(async (resolve, reject) => {
      _state.headStateName = stateName;
      _state.isFinished = false;
      _state.isEnded = false;
      await _changeState({ from: "", to: stateName }, param);
      resolve();
    });
  }

  function _changeState(transition: ITransition, param: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shared = _state.sharedVariable;

        _exit(transition, shared);

        const next = _state.states[transition.to] || null;
        if (next) {
          if (transition.to == _state.headStateName) {
            _callback.executeEvent("head");
            if (_state.isFinished) {
              _end();
              resolve();
              return;
            }
          }

          _enter(next, transition, shared);
        } else {
          _end();
        }

        resolve();
      }, 0);
    });
  }

  function _enter(
    next: IState,
    transition: ITransition,
    shared: ISharedVariable
  ) {
    _state.currentState = next;
    shared.local = {};

    _callback.executeEnter({ state: next, transition, fsm: self }, shared);
  }

  function _exit(transition: ITransition, shared: ISharedVariable) {
    const pre = _state.currentState;
    if (pre) {
      _callback.executeExit({ state: pre, transition, fsm: self }, shared);
    }
    _state.currentState = null;
  }

  function _end() {
    if (_state.isEnded) {
      return;
    }

    _state.isEnded = true;
    _callback.executeEvent("end");
  }

  function to(stateName: string, param?: any, current?: IState) {
    return new Promise(async (resolve, reject) => {
      if (!_state.currentState) {
        resolve();
        return;
      }

      if (current && current.name != _state.currentState.name) {
        resolve();
        return;
      }

      const ts = _state.transitions[_state.currentState.name];
      if (!ts) {
        resolve();
        return;
      }

      const index = ts.findIndex((x) => x.to == stateName);
      if (index != -1) {
        const t = ts[index];
        await _changeState(t, param);
      }

      resolve();
    });
  }

  function finish() {
    return new Promise(async (resolve, reject) => {
      _state.isFinished = true;
      if (_state.currentState) {
        await _changeState({ from: _state.currentState.name, to: "" }, null);
      } else {
        _end();
      }

      resolve();
    });
  }

  function putStates(x: IState[]): DefaultType {
    _builder.putStates(x);
    return self;
  }
  function putState(x: IState): DefaultType {
    _builder.putState(x);
    return self;
  }
  function putTransitions(x: ITransition[]): DefaultType {
    _builder.putTransitions(x);
    return self;
  }
  function putTransition(x: ITransition): DefaultType {
    _builder.putTransition(x);
    return self;
  }
  function putSequences(x: IState[]): DefaultType {
    _builder.putSequences(x);
    return self;
  }
  function on<K extends keyof EventHandlerNameMap>(
    eventName: K,
    handler: EventHandlerNameMap[K]
  ): DefaultType {
    _callback.on(eventName, handler);
    return self;
  }

  const _ = {
    state: _state,
  };

  const self = {
    _,
    putStates,
    putState,
    putTransitions,
    putTransition,
    putSequences,
    on,
    updateData,
    entry,
    to,
    finish,
  };

  return self;
}
