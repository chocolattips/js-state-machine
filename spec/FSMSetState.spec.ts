import useFSMSetState from "../src/FSMSetState";
import useFSMCallback from "../src/FSMCallback";
import useFSMVariable from "../src/FSMVariable";
import {
  IFSMContext,
  IState,
  IStateContext,
  ITransition,
} from "../src/FSMInterface";

describe("FSMSetState", () => {
  function setup() {
    const model = {
      currentState: null as IState | null,
      sharedVariable: {
        local: {},
        global: {},
      },
    };

    const fsmContext = {} as IFSMContext;
    const context = {} as IStateContext;
    const callback = useFSMCallback(fsmContext);
    const variable = useFSMVariable(model, context, callback);
    const setState = useFSMSetState(model, callback, variable);

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
      o.setState.enter(state, arg, <ITransition>{}, o.context);
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
      o.setState.exit(<ITransition>{}, o.context);
    });
  });
});
