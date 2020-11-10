import useFSM from "../src";

function useVegetableFSM(numSpaces: number) {
  const spaces = " ".repeat(numSpaces);
  return useFSM()
    .putSequences([
      {
        name: "avocado",
        onEnter(param) {
          param.context.to("broccoli");
        },
      },
      {
        name: "broccoli",
        onEnter(param) {
          param.context.to("carrot");
        },
      },
      {
        name: "carrot",
        onEnter(param) {
          param.context.finish();
        },
      },
    ])
    .on("enter", (param) => {
      console.log(`${spaces}[ENTER] : ${param.state.name}`);
    })
    .on("exit", (param) => {
      console.log(`${spaces}[EXIT] : ${param.state.name}`);
    });
}

function useFruitFSM(numSpaces: number) {
  const spaces = " ".repeat(numSpaces);
  return useFSM()
    .putSequences([
      {
        name: "apple",
        onEnter(param) {
          useAppleFSM(numSpaces + 2)
            .on("end", () => param.context.to("banana"))
            .entry("red");
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
      console.log(`${spaces}[ENTER] : ${param.state.name}`);
    })
    .on("exit", (param) => {
      console.log(`${spaces}[EXIT] : ${param.state.name}`);
    });
}

function useAppleFSM(numSpaces: number) {
  const spaces = " ".repeat(numSpaces);
  return useFSM()
    .putSequences([
      {
        name: "red",
        onEnter(param) {
          param.context.to("green");
        },
      },
      {
        name: "green",
        onEnter(param) {
          param.context.finish();
        },
      },
    ])
    .on("enter", (param) => {
      console.log(`${spaces}[ENTER] : ${param.state.name}`);
    })
    .on("exit", (param) => {
      console.log(`${spaces}[EXIT] : ${param.state.name}`);
    });
}

useFSM()
  .putSequences([
    {
      name: "fruit",
      onEnter(param) {
        useFruitFSM(2)
          .on("end", () => param.context.to("vegetable"))
          .entry("apple");
      },
    },
    {
      name: "vegetable",
      onEnter(param) {
        useVegetableFSM(2)
          .on("end", () => param.context.finish())
          .entry("avocado");
      },
    },
  ])
  .on("enter", (param) => {
    console.log(`[ENTER] : ${param.state.name}`);
  })
  .on("exit", (param) => {
    console.log(`[EXIT] : ${param.state.name}`);
  })
  .entry("fruit");
