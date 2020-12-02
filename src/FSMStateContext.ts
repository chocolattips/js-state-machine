import { IState, IRootContext, IStateContext } from "./FSMInterface";

export default function (state: IState, context: IRootContext): IStateContext {
  const self = {
    to,
    can,
    finish,
    emit,
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
    context.emit(eventName, data, state);
  }

  return self;
}
