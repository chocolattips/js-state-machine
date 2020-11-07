import useStateMachineBuilder from "./FSMBuilder";
import useStateMachineCallback from "./FSMCallback";
import useStateMachineControlState from "./FSMControlState";
import useStateMachineSetState from "./FSMSetState";
import useStateMachineVariable from "./FSMVariable";
import {
  KeyValueType,
  IState,
  ITransition,
  EventHandlerType,
  ISharedVariable,
  EventHandlerNameMap,
} from "./FSMInterface";

type DefaultType = ReturnType<typeof _default>;

export function useDefaultState() {
  return {
    currentState: null as IState | null,
    states: {} as KeyValueType<IState>,
    transitions: {} as KeyValueType<ITransition[]>,
    sharedVariable: { local: {}, global: {} } as ISharedVariable,
  };
}
type DefaultStateType = ReturnType<typeof useDefaultState>;

export default function _default(state?: DefaultStateType) {
  const _state = state || useDefaultState();

  const self = {
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
    clearLocalData,
  };

  const _builder = useStateMachineBuilder(_state.states, _state.transitions);
  const _callback = useStateMachineCallback();
  const _variable = useStateMachineVariable(_state, self, _callback);
  const _setState = useStateMachineSetState(_state, _callback, _variable);
  const _controlState = useStateMachineControlState(
    _state,
    self,
    _setState,
    _callback
  );

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
  function updateData(
    key: string,
    value?: any,
    targetStateName?: string
  ): DefaultType {
    _variable.updateData(key, value, targetStateName);
    return self;
  }
  function setGlobalData(data: any) {
    _variable.setGlobalData(data);
    return self;
  }
  function clearLocalData() {
    _variable.clearLocalData();
    return self;
  }

  return self;
}
