import { IState, IRootContext, IStateContext } from "./FSMInterface";

export default function (state: IState, context: IRootContext) {
  const self = {
    to,
    can,
    finish,
    emit,
    state,
  };

  async function to(stateName: string, param?: any) {
    if (context.isCurrentContext(self)) {
      return await context.to(stateName, param, state);
    }

    return false;
  }

  function can(stateName: string) {
    return context.can(stateName, state);
  }

  function finish() {
    if (context.isCurrentContext(self)) {
      context.finish();
    }
  }

  function emit(eventName: string, data?: any) {
    if (context.isCurrentContext(self)) {
      return context.emit(eventName, data, self);
    }
    return false;
  }

  return self;
}
