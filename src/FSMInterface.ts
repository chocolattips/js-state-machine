export type KeyValueType<T> = { [key: string]: T };

export interface IState {
  name: string;
  onEnter?(param: IEnterParam, variable: ISharedVariable): void;
  onUpdate?: UpdateHandlerType;
  onUpdateMethods?: { [key: string]: UpdateHandlerType };
  onExit?(param: IExitParam, variable: ISharedVariable): void;
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

export interface IEnterParam {
  context: IStateContext;
  state: IState;
  transition: ITransition;
  argument?: any;
}

export interface IExitParam {
  context: IStateContext;
  state: IState;
  transition: ITransition;
}

export interface IUpdateParam {
  context: IStateContext;
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

export type EnterHandlerType = (
  param: IEnterParam,
  variable: ISharedVariable
) => void;

export type ExitHandlerType = (
  param: IEnterParam,
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
  enter: EnterHandlerType;
  update: UpdateHandlerType;
  emit: EventHandlerType;
  exit: ExitHandlerType;
  end: EventHandlerType;
}
