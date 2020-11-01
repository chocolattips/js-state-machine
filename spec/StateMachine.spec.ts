import useStateMachine from "../src";

describe("StateMachine", () => {
  function setupSequences(ls?: any[]) {
    const fsm = useStateMachine();
    const fsmState = fsm._.state;
    ls = ls || [{ name: "hello" }, { name: "world" }];
    fsm.putSequences(ls);

    return {
      fsm,
      fsmState,
      states: ls,
    };
  }

  describe("entry", () => {
    it("", async () => {
      const o = setupSequences();

      expect(o.fsmState.currentState).toBeNull();
      await o.fsm.entry(o.states[0].name);
      expect(o.fsmState.currentState).toEqual(o.states[0]);
    });
  });

  describe("to", () => {
    it("", async () => {
      const o = setupSequences();
      await o.fsm.entry(o.states[0].name);

      expect(o.fsmState.currentState).toEqual(o.states[0]);
      await o.fsm.to(o.states[1].name);
      expect(o.fsmState.currentState).toEqual(o.states[1]);
    });
  });

  describe("finish", () => {
    it("", async (done) => {
      const o = setupSequences();
      await o.fsm.entry(o.states[0].name);

      o.fsm.on("end", () => {
        done();
      });

      expect(o.fsm._.state.isEnded).toBeFalsy();
      await o.fsm.finish();
      expect(o.fsm._.state.isEnded).toBeTruthy();
    });
  });

  describe("emit", () => {
    it("", (done) => {
      const eventName = "hello-world";
      const eventData = { hello: "WORLD" };

      useStateMachine()
        .putState({
          name: "hello",
          onEnter(param) {
            param.fsm.emit(eventName, eventData);
          },
        })
        .on("emit", (param) => {
          try {
            expect(param.eventName).toEqual(eventName);
            expect(param.data).toEqual(eventData);
            done();
          } catch (e) {
            done(e);
          }
        })
        .entry("hello");
    });
  });
});
