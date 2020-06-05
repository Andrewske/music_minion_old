const initialState = {
  limit: 0,
  fromDate: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  return state;
}
