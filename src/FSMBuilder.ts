import { IState, ITransition, KeyValueType } from "./FSMInterface";

type DefaultType = ReturnType<typeof _default>;

export default function _default(
  states: KeyValueType<IState>,
  transitions: KeyValueType<ITransition[]>
) {
  function putStates(states: IState[]): DefaultType {
    for (const o of states) {
      putState(o);
    }
    return self;
  }

  function putState(state: IState): DefaultType {
    states[state.name] = state;
    return self;
  }

  function putTransitions(transitions: ITransition[]): DefaultType {
    for (const o of transitions) {
      putTransition(o);
    }
    return self;
  }

  function putTransition(transition: ITransition): DefaultType {
    const ts = transitions[transition.from] || [];
    const index = ts.findIndex((x) => x.to == transition.to);
    if (index == -1) {
      ts.push(transition);
    } else {
      ts[index] = transition;
    }
    transitions[transition.from] = ts;
    return self;
  }

  function putSequences(states: IState[]): DefaultType {
    let pre: IState | null = null;
    for (let i = 0, len = states.length; i < len; i++) {
      const s = states[i];
      putState(s);
      if (pre) {
        putTransition({ from: pre.name, to: s.name });
      }
      pre = s;
    }
    return self;
  }

  const self = {
    putStates,
    putState,
    putTransitions,
    putTransition,
    putSequences,
  };

  return self;
}
