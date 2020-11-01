import {
  EnterExitHandlerType,
  EventHandlerNameMap,
  EventHandlerType,
  IEnterExitParam,
  IEventParam,
  ISharedVariable,
  IUpdateParam,
  KeyValueType,
  UpdateHandlerType,
} from ".";

interface ICallbacks {
  enterExits: KeyValueType<EnterExitHandlerType>;
  updates: KeyValueType<UpdateHandlerType>;
  events: KeyValueType<EventHandlerType>;
}

export default function _default(callbacks: ICallbacks) {
  function executeEnter(param: IEnterExitParam, variable: ISharedVariable) {
    const handler = callbacks.enterExits["enter"];
    if (handler) {
      handler(param, variable);
    }

    const c = param.state;
    if (c.onEnter) {
      c.onEnter(param, variable);
    }
  }

  function executeExit(param: IEnterExitParam, variable: ISharedVariable) {
    const handler = callbacks.enterExits["exit"];
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

  function executeEvent(param: IEventParam, variable: ISharedVariable) {
    const handler = callbacks.events[param.eventName];
    if (handler) {
      handler(param, variable);
    }
  }

  function on<K extends keyof EventHandlerNameMap>(
    eventName: K,
    handler: EventHandlerNameMap[K]
  ) {
    if (eventName == "enter" || eventName == "exit") {
      callbacks.enterExits[eventName] = handler as EnterExitHandlerType;
    } else if (eventName == "update") {
      callbacks.updates[eventName] = handler as UpdateHandlerType;
    } else {
      callbacks.events[eventName] = handler as EventHandlerType;
    }
  }

  const self = {
    executeEnter,
    executeExit,
    executeUpdate,
    executeEvent,
    on,
  };

  return self;
}
