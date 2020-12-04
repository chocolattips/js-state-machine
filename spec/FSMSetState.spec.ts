import useFSMSetState from "../src/FSMSetState";
import useFSMCallback from "../src/FSMCallback";
import useFSMVariable from "../src/FSMVariable";
import {
  IFSMContext,
  IRootContext,
  ISharedVariableStore,
  IState,
  IStateContext,
  ITransition,
} from "../src/FSMInterface";

describe("FSMSetState", () => {
  function setup() {
    const model = {
      currentState: null as IState | null,
      currentContext: null as IStateContext | null,
      sharedVariable: {
        locals: {},
        internals: {},
        global: {},
      } as ISharedVariableStore,
    };

    const fsmContext = {} as IFSMContext;
    const context = {} as IStateContext;
    const rootContext = {} as IRootContext;
    const callback = useFSMCallback(fsmContext);
    const variable = useFSMVariable(model, callback);
    const setState = useFSMSetState(model, rootContext, callback, variable);

    return {
      model,
      context,
      setState,
    };
  }

  describe("enter", () => {
    it("", (done) => {
      const o = setup();
      const arg = { hello: "world" };
      const state = <IState>{
        name: "",
        onEnter(param) {
          try {
            expect(param.argument).toEqual(arg);
          } catch (e) {
            done(e);
          }
          done();
        },
      };
      o.setState.enter(state, arg, <ITransition>{});
    });
  });

  describe("exit", () => {
    it("", (done) => {
      const o = setup();
      const state = <IState>{
        name: "",
        onExit() {
          done();
        },
      };
      o.model.currentState = state;
      o.model.currentContext = {} as IStateContext;
      o.setState.exit(<ITransition>{});
    });
  });
});
