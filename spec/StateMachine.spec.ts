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

  describe("head", () => {
    it("", async () => {
      const o = setupSequences();
      const headName = o.states[0].name;
      await o.fsm.entry(headName);

      expect(o.fsm.isHead(headName)).toBeTruthy();
      o.fsm.setHead(o.states[1].name);
      expect(o.fsm.isHead(headName)).toBeFalsy();
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

    it("variable", async (done) => {
      const texts = {
        local: "LOCAL",
        state: "STATE",
        global: "GLOBAL",
      };
      const states = [
        <IState>{
          name: "hello",
          onEnter(param, variable) {
            if (variable.global.text) {
              expect(variable.local.text).toBeUndefined();
              expect(variable.state.text).toEqual(texts.state);
              expect(variable.global.text).toEqual(texts.global);
              done();
            } else {
              variable.local.text = texts.local;
              variable.state.text = texts.state;
              variable.global.text = texts.global;
              param.context.to("world");
            }
          },
        },
        <IState>{
          name: "world",
          onEnter(param, variable) {
            expect(variable.local.text).toBeUndefined();
            expect(variable.state.text).toBeUndefined();
            expect(variable.global.text).toEqual(texts.global);
            param.context.to("hello");
          },
        },
      ];
      const fsm = useStateMachine().putSequences(states, true);
      await fsm.entry(states[0].name);
    });
  });

  describe("can", () => {
    it("", async () => {
      const o = setupSequences();
      await o.fsm.entry(o.states[0].name);

      expect(o.fsm.can(o.states[1].name)).toBeTruthy();
      expect(o.fsm.can("xxxx")).toBeFalsy();
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
