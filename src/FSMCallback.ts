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
} from "./FSMInterface";

interface ICallbacks {
  enter: EnterHandlerType | null;
  exit: ExitHandlerType | null;
  updates: KeyValueType<UpdateHandlerType>;
  events: KeyValueType<EventHandlerType>;
  emits: KeyValueType<EventHandlerType>;
}

export default function _default(callbacks: ICallbacks) {
  function executeEnter(param: IEnterParam, variable: ISharedVariable) {
    const handler = callbacks.enter;
    if (handler) {
      handler(param, variable);
    }

    const c = param.state;
    if (c.onEnter) {
      c.onEnter(param, variable);
    }
  }

  function executeExit(param: IExitParam, variable: ISharedVariable) {
    const handler = callbacks.exit;
    if (handler) {
      handler(param, variable);
    }

    const c = param.state;
    if (c.onExit) {
      c.onExit(param, variable);
    }
  }

  function executeUpdate(param: IUpdateParam, variable: ISharedVariable) {
    const handler = callbacks.updates["update"];
    if (handler) {
      handler(param, variable);
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
    const handler = callbacks.events[eventName];
    if (handler) {
      handler(param, variable);
    }
  }

  function executeEmit(param: IEventParam, variable: ISharedVariable) {
    executeEvent("emit", param, variable);
    const handler = callbacks.emits[param.eventName];
    if (handler) {
      handler(param, variable);
    }
  }

  function on<K extends keyof EventHandlerNameMap>(
    eventName: K,
    handler: EventHandlerNameMap[K]
  ) {
    if (eventName == "enter") {
      callbacks.enter = handler as EnterHandlerType;
    } else if (eventName == "exit") {
      callbacks.exit = handler as ExitHandlerType;
    } else if (eventName == "update") {
      callbacks.updates[eventName] = handler as UpdateHandlerType;
    } else {
      callbacks.events[eventName] = handler as EventHandlerType;
    }
  }

  function onEmitMethods(methods: { [key: string]: EventHandlerType }) {
    for (const key in methods) {
      callbacks.emits[key] = methods[key];
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
