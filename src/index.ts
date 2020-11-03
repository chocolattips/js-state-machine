import useStateMachineBuilder from "./FSMBuilder";
import useStateMachineCallback from "./FSMCallback";
import useStateMachineSetState from "./FSMSetState";
import {
  KeyValueType,
  IState,
  ITransition,
  EnterHandlerType,
  ExitHandlerType,
  UpdateHandlerType,
  EventHandlerType,
  ISharedVariable,
  EventHandlerNameMap,
} from "./FSMInterface";

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
      enter: null as EnterHandlerType | null,
      exit: null as ExitHandlerType | null,
      updates: {} as KeyValueType<UpdateHandlerType>,
      events: {} as KeyValueType<EventHandlerType>,
      emits: {} as KeyValueType<EventHandlerType>,
    },
    sharedVariable: { local: {}, global: {} } as ISharedVariable,
  };

  const _builder = useStateMachineBuilder(_state.states, _state.transitions);
  const _callback = useStateMachineCallback(_state.handler);
  const _setState = useStateMachineSetState(_state, _callback);

  function updateData(key: string, value?: any, targetStateName?: string) {
    const c = _state.currentState;
    if (c && (!targetStateName || targetStateName == c.name)) {
      _callback.executeUpdate(
        { state: c, key, value, context: self },
        _state.sharedVariable
      );
    } else {
      console.log(`x not update data : ${key}`);
    }
    return self;
  }

  function entry<T>(stateName: string, argument?: T) {
    return new Promise(async (resolve, reject) => {
      _state.headStateName = stateName;
      _state.isFinished = false;
      _state.isEnded = false;
      await _changeState({ from: "", to: stateName }, argument);
      resolve();
    });
  }

  function _changeState(transition: ITransition, argument: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shared = _state.sharedVariable;

        _setState.exit(transition, self);

        const next = _state.states[transition.to] || null;
        if (next) {
          if (transition.to == _state.headStateName) {
            _callback.executeEvent("head", { eventName: "head" }, shared);
            if (_state.isFinished) {
              _setState.end();
              resolve();
              return;
            }
          }

          _setState.enter(next, argument, transition, self);
        } else {
          _setState.end();
        }

        resolve();
      }, 0);
    });
  }

  function to(stateName: string, argument?: any, current?: IState) {
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
        await _changeState(t, argument);
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
        _setState.end();
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
  function emit(eventName: string, data?: any) {
    _callback.executeEmit({ eventName, data }, _state.sharedVariable);
  }
  function on<K extends keyof EventHandlerNameMap>(
    eventName: K,
    handler: EventHandlerNameMap[K]
  ): DefaultType {
    _callback.on(eventName, handler);
    return self;
  }
  function onEmitMethods(methods: {
    [key: string]: EventHandlerType;
  }): DefaultType {
    _callback.onEmitMethods(methods);
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
    emit,
    onEmitMethods,
  };

  return self;
}
