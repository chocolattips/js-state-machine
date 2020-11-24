import { FSMCallbackType } from "./FSMCallback";
import {
  ISharedVariable,
  ISharedVariableStore,
  IState,
  IStateContext,
} from "./FSMInterface";

interface IModel {
  sharedVariable: ISharedVariableStore;
  readonly currentState: IState | null;
}

export type FSMVariableType = ReturnType<typeof _default>;

export default function _default(
  model: IModel,
  context: IStateContext,
  callback: FSMCallbackType
) {
  function updateData(key: string, value?: any, targetStateName?: string) {
    const c = model.currentState;
    if (c && (!targetStateName || targetStateName == c.name)) {
      callback.executeUpdate(
        { state: c, key, value, context },
        getVariable(c.name)
      );
    } else {
      console.log(`x not update data : ${key}`);
    }
  }

  function setGlobalData(data: any) {
    model.sharedVariable.global = data || {};
  }

  function clearLocalData() {
    const c = model.currentState;
    if (c) {
      model.sharedVariable.locals[c.name] = {};
    }
  }

  function getVariable(stateName: string) {
    const s = model.sharedVariable;
    if (!stateName) {
      return <ISharedVariable>{ local: {}, state: {}, global: s.global };
    }

    if (!s.locals[stateName]) {
      s.locals[stateName] = {};
    }
    if (!s.states[stateName]) {
      s.states[stateName] = {};
    }

    return <ISharedVariable>{
      local: s.locals[stateName],
      state: s.states[stateName],
      global: s.global,
    };
  }

  return {
    updateData,
    setGlobalData,
    clearLocalData,
    getVariable,
  };
}
