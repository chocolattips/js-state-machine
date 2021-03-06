import {
  EnterHandlerType,
  ExitHandlerType,
  EventHandlerNameMap,
  EventHandlerType,
  IEnterParam,
  IExitParam,
  IEventParam,
  ISharedVariable,
  IUpdateParam,
  KeyValueType,
  UpdateHandlerType,
  EmitHandlerType,
  IFSMEmitParam,
  IFSMContext,
} from "./FSMInterface";

export function useDefaultState() {
  return {
    enter: null as EnterHandlerType | null,
    exit: null as ExitHandlerType | null,
    emit: null as EmitHandlerType | null,
    updates: {} as KeyValueType<UpdateHandlerType>,
    events: {} as KeyValueType<EventHandlerType>,
    emits: {} as KeyValueType<EmitHandlerType>,
  };
}
type DefaultStateType = ReturnType<typeof useDefaultState>;

export type FSMCallbackType = ReturnType<typeof _default>;

export default function _default(
  context: IFSMContext,
  state?: DefaultStateType
) {
  const _state = state || useDefaultState();

  function executeEnter(param: IEnterParam, variable: ISharedVariable) {
    const handler = _state.enter;
    if (handler) {
      handler({ ...param, context }, variable);
    }

    const c = param.state;
    if (c.onEnter) {
      c.onEnter(param, variable);
    }
  }

  function executeExit(param: IExitParam, variable: ISharedVariable) {
    const handler = _state.exit;
    if (handler) {
      handler({ ...param, context }, variable);
    }

    const c = param.state;
    if (c.onExit) {
      c.onExit(param, variable);
    }
  }

  function executeUpdate(param: IUpdateParam, variable: ISharedVariable) {
    const handler = _state.updates["update"];
    if (handler) {
      handler({ ...param, context }, variable);
    }

    const c = param.state;
    if (c.onUpdate) {
      c.onUpdate(param, variable);
    }
    if (c.onUpdateMethods) {
      const h = c.onUpdateMethods[param.key];
      if (h) {
        h(param, variable);
      }
    }
  }

  function executeEvent(
    eventName: string,
    param: IEventParam,
    variable: ISharedVariable
  ) {
    const handler = _state.events[eventName];
    if (handler) {
      handler({ ...param, context }, variable);
    }
  }

  function executeEmit(param: IFSMEmitParam, variable: ISharedVariable) {
    if (_state.emit) {
      _state.emit(param, variable);
    }

    const handler = _state.emits[param.eventName];
    if (handler) {
      handler(param, variable);
    }
  }

  function on<K extends keyof EventHandlerNameMap>(
    eventName: K,
    handler: EventHandlerNameMap[K]
  ) {
    if (eventName == "enter") {
      _state.enter = handler as EnterHandlerType;
    } else if (eventName == "exit") {
      _state.exit = handler as ExitHandlerType;
    } else if (eventName == "update") {
      _state.updates[eventName] = handler as UpdateHandlerType;
    } else if (eventName == "emit") {
      _state.emit = handler as EmitHandlerType;
    } else {
      _state.events[eventName] = handler as EventHandlerType;
    }
  }

  function onEmitMethods(methods: { [key: string]: EmitHandlerType }) {
    for (const key in methods) {
      _state.emits[key] = methods[key];
    }
  }

  const self = {
    executeEnter,
    executeExit,
    executeUpdate,
    executeEvent,
    executeEmit,
    on,
    onEmitMethods,
  };

  return self;
}
