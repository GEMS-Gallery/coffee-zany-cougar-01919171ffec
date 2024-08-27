import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface RoomConfig {
  'enable_people_ui' : boolean,
  'enable_hand_raising' : boolean,
  'enable_chat' : boolean,
  'redirect_on_meeting_exit' : [] | [string],
  'start_with_video_off' : boolean,
  'enable_prejoin_ui' : boolean,
  'owner_only_broadcast' : boolean,
  'enable_emoji_reactions' : boolean,
  'enable_screenshare' : boolean,
  'enable_network_ui' : boolean,
  'close_tab_on_exit' : boolean,
  'enable_recording' : boolean,
  'enable_knocking' : boolean,
}
export interface _SERVICE {
  'createRoom' : ActorMethod<[string, RoomConfig], undefined>,
  'getRoomConfig' : ActorMethod<[string], [] | [RoomConfig]>,
  'getRoomUrl' : ActorMethod<[string], string>,
  'updateRoomConfig' : ActorMethod<[string, RoomConfig], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
