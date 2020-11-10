import { FSMCallbackType } from "./FSMCallback";
import { ISharedVariable, IState, IStateContext } from "./FSMInterface";

interface IModel {
  sharedVariable: ISharedVariable;
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
        model.sharedVariable
      );
    } else {
      console.log(`x not update data : ${key}`);
    }
  }

  function setGlobalData(data: any) {
    model.sharedVariable.global = data || {};
  }

  function clearLocalData() {
    model.sharedVariable.local = {};
  }

  return {
    updateData,
    setGlobalData,
    clearLocalData,
  };
}
