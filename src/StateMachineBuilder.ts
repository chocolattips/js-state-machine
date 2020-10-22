import { IState, ITransition, KeyValueType } from "./StateMachine";

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

  const self = {
    putStates,
    putState,
    putTransitions,
    putTransition,
  };

  return self;
}
