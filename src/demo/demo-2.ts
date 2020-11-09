import useFSM from "..";

function useVegetableFSM(onComplete: Function, numIndent: number) {
  const indent = " ".repeat(numIndent);
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
      console.log(`${indent}[ENTER] : ${param.state.name}`);
    })
    .on("exit", (param) => {
      console.log(`${indent}[EXIT] : ${param.state.name}`);
    })
    .on("end", () => onComplete())
    .entry("avocado");
}

function useFruitFSM(onComplete: Function, numIndent: number) {
  const indent = " ".repeat(numIndent);
  return useFSM()
    .putSequences([
      {
        name: "apple",
        onEnter(param) {
          useAppleFSM(() => {
            param.context.to("banana");
          }, numIndent + 2);
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
      console.log(`${indent}[ENTER] : ${param.state.name}`);
    })
    .on("exit", (param) => {
      console.log(`${indent}[EXIT] : ${param.state.name}`);
    })
    .on("end", () => onComplete())
    .entry("apple");
}

function useAppleFSM(onComplete: Function, numIndent: number) {
  const indent = " ".repeat(numIndent);
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
      console.log(`${indent}[ENTER] : ${param.state.name}`);
    })
    .on("exit", (param) => {
      console.log(`${indent}[EXIT] : ${param.state.name}`);
    })
    .on("end", () => onComplete())
    .entry("red");
}

useFSM()
  .putSequences([
    {
      name: "fruit",
      onEnter(param) {
        useFruitFSM(() => {
          param.context.to("vegetable");
        }, 2);
      },
    },
    {
      name: "vegetable",
      onEnter(param) {
        useVegetableFSM(() => {
          param.context.finish();
        }, 2);
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
