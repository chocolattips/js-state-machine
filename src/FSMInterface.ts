export type KeyValueType<T> = { [key: string]: T };

export interface IState {
  name: string;
  onEnter?(param: IEnterParam, variable: ISharedVariable): void;
  onUpdate?(param: IUpdateParam, variable: ISharedVariable): void;
  onUpdateMethods?: {
    [key: string]: (param: IUpdateParam, variable: ISharedVariable) => void;
  };
  onExit?(param: IExitParam, variable: ISharedVariable): void;
}

export interface ITransition {
  from: string;
  to: string;
}

export interface IContextBase {
  to: (stateName: string, param?: any, current?: IState) => Promise<boolean>;
  can: (stateName: string, current?: IState) => boolean;
  finish: () => void;
}

export interface IStateContext extends IContextBase {
  state: IState;
  emit: (eventName: string, data?: any) => boolean;
}

export interface IFSMContext extends IContextBase {
  updateData: (key: string, value?: any, targetStateName?: string) => void;
}

export interface IRootContext extends IContextBase {
  isCurrentContext(context: IStateContext): boolean;
  emit: (eventName: string, data?: any, context?: IStateContext) => boolean;
}

export interface IEnterParamBase {
  state: IState;
  transition: ITransition;
  argument?: any;
}

export interface IEnterParam extends IEnterParamBase {
  context: IStateContext;
}

export interface IFSMEnterParam extends IEnterParamBase {
  context: IFSMContext;
}

export interface IExitParamBase {
  state: IState;
  transition: ITransition;
}

export interface IExitParam extends IExitParamBase {
  context: IStateContext;
}

export interface IFSMExitParam extends IExitParamBase {
  context: IFSMContext;
}

export interface IUpdateParamBase {
  state: IState;
  key: string;
  value?: any;
}

export interface IUpdateParam extends IUpdateParamBase {
  context: IStateContext;
}

export interface IFSMUpdateParam extends IUpdateParamBase {
  context: IFSMContext;
}

export interface IEventParam {
  eventName: string;
  data?: any;
}

export interface IFSMEmitParam extends IEventParam {
  context: IFSMContext;
  state: IState;
}

export interface IFSMEventParam extends IEventParam {
  context: IFSMContext;
}

export interface ISharedVariable {
  local: KeyValueType<any>;
  state: KeyValueType<any>;
  global: KeyValueType<any>;
}

export interface ISharedVariableStore {
  locals: KeyValueType<KeyValueType<any>>;
  internals: KeyValueType<KeyValueType<any>>;
  global: KeyValueType<any>;
}

export type EnterHandlerType = (
  param: IFSMEnterParam,
  variable: ISharedVariable
) => void;

export type ExitHandlerType = (
  param: IFSMExitParam,
  variable: ISharedVariable
) => void;

export type UpdateHandlerType = (
  param: IFSMUpdateParam,
  variable: ISharedVariable
) => void;

export type EventHandlerType = (
  param: IFSMEventParam,
  variable: ISharedVariable
) => void;

export type EmitHandlerType = (
  param: IFSMEmitParam,
  variable: ISharedVariable
) => void;

export interface EventHandlerNameMap {
  head: EventHandlerType;
  enter: EnterHandlerType;
  update: UpdateHandlerType;
  emit: EmitHandlerType;
  exit: ExitHandlerType;
  end: EventHandlerType;
}
