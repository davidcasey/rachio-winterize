interface SequenceTrainerState {
  currentIndex: number;
  nextIndex: number;
  isTraining: boolean;
  isRecovering: boolean;
  blowOutTime: number;
  recoveryTime: number;
  cycleId: string;
  zoneCount: number;
}

// action types
type SequenceTrainerAction =
  | { type: 'START_TRAINING'; zoneCount: number }
  | { type: 'TICK' }
  | { type: 'NEXT_ZONE' }
  | { type: 'SWITCH_TO_RECOVERY' }
  | { type: 'SKIP_ZONE' }
  | { type: 'ADVANCE_CYCLE' }
  | { type: 'RESET' };

export const initialState: SequenceTrainerState = {
  isTraining: false,
  isRecovering: false,
  blowOutTime: 0,
  recoveryTime: 0,
  cycleId: '',
  currentIndex: 0,
  nextIndex: 1,
  zoneCount: 0,
};

export const sequenceTrainerReducer = (state: SequenceTrainerState, action: SequenceTrainerAction): SequenceTrainerState => {
  switch (action.type) {
    case 'START_TRAINING':
      return {
        ...state,
        isTraining: true,
        cycleId: crypto.randomUUID(),
        zoneCount: action.zoneCount,
      };
    case 'TICK':
      if (state.isRecovering) {
        return { ...state, recoveryTime: state.recoveryTime + 1 };
      }
      return { ...state, blowOutTime: state.blowOutTime + 1 };
    case 'SWITCH_TO_RECOVERY':
      return { ...state, isRecovering: true };
    case 'NEXT_ZONE':
      if (state.isRecovering) {
        return {
          ...state,
          isRecovering: false,
          blowOutTime: 0,
          recoveryTime: 0,
          currentIndex: state.nextIndex,
          nextIndex: (state.nextIndex + 1) % state.zoneCount,
          cycleId: state.nextIndex === 0 ? crypto.randomUUID() : state.cycleId,
        };
      }
      return state;
    case 'SKIP_ZONE':
      return { 
        ...state,
        nextIndex: (state.nextIndex + 1) % state.zoneCount,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};
