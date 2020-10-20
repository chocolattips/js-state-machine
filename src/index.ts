import useStateMachine from "./StateMachine";

useStateMachine()
  .putState({
    name: "hello",
    onEnter(transition, param) {
      console.log(`+ hello`);
      console.log(transition);
      console.log(param);
    },
    onExit(transition) {
      console.log("- hello");
      console.log(transition);
    },
  })
  .putState({
    name: "world",
    onEnter(transition, param) {
      console.log("+ world");
      console.log(transition);
      console.log(param);
    },
    onExit(transition) {
      console.log("- world");
      console.log(transition);
    },
  })
  .putState({
    name: "apple",
    onEnter(transition, param) {
      console.log("+ apple");
      console.log(transition);
      console.log(param);
    },
    onExit(transition) {
      console.log("- apple");
      console.log(transition);
    },
  })
  .putTransition({
    from: "hello",
    to: "world",
  })
  .putTransition({
    from: "world",
    to: "apple",
  })
  .enter("hello", { abc: 123 })
  .to("world", { bbb: "ccc" })
  .to("apple", { test: 111 });
