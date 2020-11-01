export type KeyValueType<T> = { [key: string]: T };

export interface IState {
  name: string;
  onEnter?(param: IEnterExitParam, variable: ISharedVariable): void;
  onUpdate?: UpdateHandlerType;
  onUpdateMethods?: { [key: string]: UpdateHandlerType };
  onExit?(param: IEnterExitParam, variable: ISharedVariable): void;
}

export interface ITransition {
  from: string;
  to: string;
}

export interface IStateContext {
  to: (stateName: string, param?: any, current?: IState) => void;
  finish: () => void;
  emit: (eventName: string, data?: any) => void;
}

export interface IEnterExitParam {
  fsm: IStateContext;
  state: IState;
  transition: ITransition;
}

export interface IUpdateParam {
  fsm: IStateContext;
  state: IState;
  key: string;
  value?: any;
}

export interface IEventParam {
  eventName: string;
  data?: any;
}

export interface ISharedVariable {
  local: KeyValueType<any>;
  global: KeyValueType<any>;
}

export type EnterExitHandlerType = (
  param: IEnterExitParam,
  variable: ISharedVariable
) => void;

export type UpdateHandlerType = (
  param: IUpdateParam,
  variable: ISharedVariable
) => void;

export type EventHandlerType = (
  param: IEventParam,
  variable: ISharedVariable
) => void;

export interface EventHandlerNameMap {
  head: EventHandlerType;
  enter: EnterExitHandlerType;
  update: UpdateHandlerType;
  emit: EventHandlerType;
  exit: EnterExitHandlerType;
  end: EventHandlerType;
}
