import useStateMachineBuilder from "./FSMBuilder";
import useStateMachineCallback from "./FSMCallback";
import useStateMachineSetState from "./FSMSetState";
import useStateMachineControlState from "./FSMControlState";
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
    emit,
    on,
    onEmitMethods,
    entry,
    to,
    finish,

    updateData,
    setGlobalData,
  };

  const _builder = useStateMachineBuilder(_state.states, _state.transitions);
  const _callback = useStateMachineCallback(_state.handler);
  const _setState = useStateMachineSetState(_state, _callback);
  const _controlState = useStateMachineControlState(
    _state,
    self,
    _setState,
    _callback
  );

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

  function setGlobalData(data: any) {
    _state.sharedVariable.global = data || {};
    return self;
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
  async function entry(
    stateName: string,
    argument?: any
  ): Promise<DefaultType> {
    await _controlState.entry(stateName, argument);
    return self;
  }
  async function to(
    stateName: string,
    argument?: any,
    current?: IState
  ): Promise<DefaultType> {
    await _controlState.to(stateName, argument, current);
    return self;
  }
  async function finish(): Promise<DefaultType> {
    await _controlState.finish();
    return self;
  }

  return self;
}
