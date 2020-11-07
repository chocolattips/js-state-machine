import useStateMachine, { useDefaultState } from "../src";
import { IState } from "../src/FSMInterface";

describe("StateMachine", () => {
  function setupSequences(ls?: any[]) {
    const fsmState = useDefaultState();
    const fsm = useStateMachine(fsmState);
    ls = ls || [{ name: "hello" }, { name: "world" }];
    fsm.putSequences(ls);

    return {
      fsm,
      fsmState,
      states: ls,
    };
  }

  describe("updateData", () => {
    it("", async (done) => {
      const key = "apple";
      const value = { price: 300 };

      const o = setupSequences([
        <IState>{
          name: "",
          onUpdateMethods: {
            apple(param) {
              try {
                expect(param.value).toEqual(value);
              } catch (e) {
                done(e);
              }

              done();
            },
          },
        },
      ]);

      await o.fsm.entry(o.states[0].name);
      o.fsm.updateData(key, value);
    });
  });

  describe("setGlobalData", () => {
    it("", async (done) => {
      const globalData = { fruit: { apple: { price: 300 } } };

      const o = setupSequences([
        <IState>{
          name: "",
          onEnter(_, variable) {
            try {
              expect(variable.global).toEqual(globalData);
            } catch (e) {
              done(e);
            }

            done();
          },
        },
      ]);

      o.fsm.setGlobalData(globalData);
      await o.fsm.entry(o.states[0].name);
    });
  });

  describe("entry", () => {
    it("", async () => {
      const o = setupSequences();

      expect(o.fsmState.currentState).toBeNull();
      await o.fsm.entry(o.states[0].name);
      expect(o.fsmState.currentState).toEqual(o.states[0]);
    });

    it("argument", async (done) => {
      const o = setupSequences();

      const argument = { hello: 1234 };
      o.fsm.on("enter", (param) => {
        try {
          expect(param.argument).toEqual(argument);
          done();
        } catch (e) {
          done(e);
        }
      });

      await o.fsm.entry(o.states[0].name, argument);
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

    it("argument", async (done) => {
      const o = setupSequences();
      await o.fsm.entry(o.states[0].name);

      const argument = { hello: 1234 };
      o.fsm.on("enter", (param) => {
        try {
          expect(param.argument).toEqual(argument);
          done();
        } catch (e) {
          done(e);
        }
      });

      await o.fsm.to(o.states[1].name, argument);
    });
  });

  describe("emit", () => {
    function setup() {
      const eventName = "helloworld";
      const eventData = { hello: "WORLD" };

      const fsm = useStateMachine().putState({
        name: "hello",
        onEnter(param) {
          param.context.emit(eventName, eventData);
        },
      });

      return {
        fsm,
        eventName,
        eventData,
      };
    }

    it("onEmitMethods", (done) => {
      const o = setup();

      o.fsm
        .onEmitMethods({
          helloworld: (param) => {
            try {
              expect(param.eventName).toEqual(o.eventName);
              expect(param.data).toEqual(o.eventData);
              done();
            } catch (e) {
              done(e);
            }
          },
        })
        .entry("hello");
    });

    it("on emit", (done) => {
      const o = setup();

      o.fsm
        .on("emit", (param) => {
          try {
            expect(param.eventName).toEqual(o.eventName);
            expect(param.data).toEqual(o.eventData);
            done();
          } catch (e) {
            done(e);
          }
        })
        .entry("hello");
    });
  });
});
