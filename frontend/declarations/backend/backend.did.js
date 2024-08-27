export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getRoomUrl' : IDL.Func([], [IDL.Text], ['query']),
    'setRoomUrl' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
