import { useDefaultState } from "../src";
import useFSMControlState, {
  useDefaultState as useDefaultStateControlState,
} from "../src/FSMControlState";
import useFSMBuilder from "../src/FSMBuilder";
import useFSMCallback from "../src/FSMCallback";
import useFSMSetState from "../src/FSMSetState";
import useFSMVariable from "../src/FSMVariable";
import { IState, IStateContext } from "../src/FSMInterface";

describe("FSMControlState", () => {
  function setup(ls?: IState[]) {
    const _state = useDefaultState();
    const _builder = useFSMBuilder(_state.states, _state.transitions);
    const _context = {} as IStateContext;
    const _callback = useFSMCallback();
    const _variable = useFSMVariable(_state, _context, _callback);
    const _setState = useFSMSetState(_state, _callback, _variable);
    const model = useDefaultStateControlState();
    const _controlState = useFSMControlState(
      _state,
      _context,
      _setState,
      _callback,
      model
    );

    ls = ls || [{ name: "a" }];
    _builder.putSequences(ls);

    return {
      state: _state,
      callback: _callback,
      model,
      controlState: _controlState,
    };
  }

  function createStates(done: any, argument?: any) {
    const states: IState[] = [
      {
        name: "aaa",
      },
      {
        name: "bbb",
        onEnter(param) {
          try {
            expect(param.argument).toEqual(argument);
          } catch (e) {
            done(e);
          }
          done();
        },
      },
    ];
    return states;
  }

  describe("entry", () => {
    it("", async (done) => {
      const argument = { hello: "world" };
      const states = createStates(done, argument);
      const o = setup(states);
      await o.controlState.entry(states[1].name, argument);
    });
  });

  describe("changeState", () => {
    it("", async (done) => {
      const argument = { hello: "world" };
      const states = createStates(done, argument);
      const o = setup(states);
      await o.controlState.changeState(
        { from: states[0].name, to: states[1].name },
        argument
      );
    });
  });

  describe("to", () => {
    it("", async (done) => {
      const argument = { hello: "world" };
      const states = createStates(done, argument);
      const o = setup(states);
      await o.controlState.entry(states[0].name);
      await o.controlState.to(states[1].name, argument);
    });
  });

  describe("finish", () => {
    it("", async (done) => {
      const states = createStates(done);
      states[1].onEnter = undefined;
      states[1].onExit = (param) => {
        done();
      };
      const o = setup(states);
      await o.controlState.entry(states[1].name);
      await o.controlState.finish();
    });
  });

  describe("end", () => {
    it("", async (done) => {
      const o = setup();
      o.callback.on("end", () => {
        done();
      });
      o.controlState.end();
    });
  });
});
