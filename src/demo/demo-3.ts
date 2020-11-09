import useFSM from "..";

useFSM()
  .putSequences(
    [
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
          param.context.to("apple");
        },
      },
    ],
    true
  )
  .on("head", (param, variable) => {
    let count: number = variable.global.count || 0;
    console.log(`[HEAD] : ${count}`);
    count++;
    variable.global.count = count;

    if (count > 5) {
      param.context.finish();
    }
  })
  .on("enter", (param) => {
    console.log(`  [ENTER] : ${param.state.name}`);
  })
  .on("exit", (param) => {
    console.log(`  [EXIT] : ${param.state.name}`);
  })
  .on("end", () => {
    console.log(`[END]`);
  })
  .entry("apple");
