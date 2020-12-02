import { IState, IRootContext, IStateContext } from "./FSMInterface";

export default function (state: IState, context: IRootContext) {
  const self = {
    to,
    can,
    finish,
    emit,
    state,
  };

  function to(stateName: string, param?: any) {
    context.to(stateName, param, state);
  }

  function can(stateName: string) {
    return context.can(stateName, state);
  }

  function finish() {
    context.finish();
  }

  function emit(eventName: string, data?: any) {
    return context.emit(eventName, data, self);
  }

  return self;
}
