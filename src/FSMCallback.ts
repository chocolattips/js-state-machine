import {
  ISharedVariable,
  IUpdateParam,
  UpdateHandlerType,
} from "./StateMachine";

export default function _default() {
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
    executeUpdate,
  };

  return self;
}
