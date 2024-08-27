export const idlFactory = ({ IDL }) => {
  const RoomConfig = IDL.Record({
    'enable_people_ui' : IDL.Bool,
    'enable_hand_raising' : IDL.Bool,
    'enable_chat' : IDL.Bool,
    'redirect_on_meeting_exit' : IDL.Opt(IDL.Text),
    'start_with_video_off' : IDL.Bool,
    'enable_prejoin_ui' : IDL.Bool,
    'owner_only_broadcast' : IDL.Bool,
    'enable_emoji_reactions' : IDL.Bool,
    'enable_screenshare' : IDL.Bool,
    'enable_network_ui' : IDL.Bool,
    'close_tab_on_exit' : IDL.Bool,
    'enable_recording' : IDL.Bool,
    'enable_knocking' : IDL.Bool,
  });
  return IDL.Service({
    'createRoom' : IDL.Func([IDL.Text, RoomConfig], [], []),
    'getRoomConfig' : IDL.Func([IDL.Text], [IDL.Opt(RoomConfig)], ['query']),
    'getRoomUrl' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'updateRoomConfig' : IDL.Func([IDL.Text, RoomConfig], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
