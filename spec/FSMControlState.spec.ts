import { useDefaultState } from "../src";
import useFSMControlState, {
  useDefaultState as useDefaultStateControlState,
} from "../src/FSMControlState";
import useFSMCallback from "../src/FSMCallback";
import useFSMSetState from "../src/FSMSetState";
import useFSMVariable from "../src/FSMVariable";
import { IStateContext } from "../src/FSMInterface";

describe("FSMControlState", () => {
  const _state = useDefaultState();
  const _context = {} as IStateContext;
  const _callback = useFSMCallback();
  const _variable = useFSMVariable(_state, _context, _callback);
  const _setState = useFSMSetState(_state, _callback, _variable);

  const model = useDefaultStateControlState();
  const _controlState = useFSMControlState(
    _state,
    _context,
    _setState,
    _callback,
    model
  );

  describe("finish", () => {
    it("", async () => {
      expect(model.isFinished).toBeFalsy();
      await _controlState.finish();
      expect(model.isFinished).toBeTruthy();
    });
  });
});
