import {
  EnterExitHandlerType,
  IEnterExitParam,
  ISharedVariable,
  IUpdateParam,
  UpdateHandlerType,
} from "./StateMachine";

export default function _default() {
  function executeEnter(
    param: IEnterExitParam,
    variable: ISharedVariable,
    handler: EnterExitHandlerType
  ) {
    if (handler) {
      handler(param, variable);
    }

    const c = param.state;
    if (c.onEnter) {
      c.onEnter(param, variable);
    }
  }

  function executeExit(
    param: IEnterExitParam,
    variable: ISharedVariable,
    handler: EnterExitHandlerType
  ) {
    if (handler) {
      handler(param, variable);
    }

    const c = param.state;
    if (c.onExit) {
      c.onExit(param, variable);
    }
  }

  function executeUpdate(
    param: IUpdateParam,
    variable: ISharedVariable,
    handler: UpdateHandlerType
  ) {
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

  const self = {
    executeEnter,
    executeExit,
    executeUpdate,
  };

  return self;
}
