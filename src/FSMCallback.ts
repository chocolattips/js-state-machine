import {
  EnterExitHandlerType,
  EventHandlerNameMap,
  IEnterExitParam,
  ISharedVariable,
  IUpdateParam,
  KeyValueType,
  UpdateHandlerType,
} from "./StateMachine";

interface ICallbacks {
  enterExits: KeyValueType<EnterExitHandlerType>;
  updates: KeyValueType<UpdateHandlerType>;
  events: KeyValueType<Function>;
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

  function executeEvent(eventName: string) {
    const handler = callbacks.events[eventName];
    if (handler) {
      handler();
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
      callbacks.events[eventName] = handler;
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
