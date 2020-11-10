import useFSM from "../src";

useFSM()
  .putSequences([
    {
      name: "apple",
      onEnter(param) {
        param.context.to("banana");
      },
    },
    {
      name: "banana",
      onEnter(param) {
        param.context.to("cherry");
      },
    },
    {
      name: "cherry",
      onEnter(param) {
        param.context.finish();
      },
    },
  ])
  .on("enter", (param) => {
    console.log(`[ENTER] : ${param.state.name}`);
  })
  .on("exit", (param) => {
    console.log(`[EXIT] : ${param.state.name}`);
  })
  .entry("apple");
