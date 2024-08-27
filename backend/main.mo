import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor {
  type RoomConfig = {
    enable_people_ui: Bool;
    enable_prejoin_ui: Bool;
    enable_network_ui: Bool;
    enable_emoji_reactions: Bool;
    enable_hand_raising: Bool;
    enable_screenshare: Bool;
    enable_recording: Bool;
    start_with_video_off: Bool;
    enable_knocking: Bool;
    enable_chat: Bool;
    owner_only_broadcast: Bool;
    close_tab_on_exit: Bool;
    redirect_on_meeting_exit: ?Text;
  };

  stable var stableRoomConfigs: [(Text, RoomConfig)] = [];

  let roomConfigs = HashMap.fromIter<Text, RoomConfig>(stableRoomConfigs.vals(), 0, Text.equal, Text.hash);

  public func createRoom(name: Text, config: RoomConfig) : async () {
    roomConfigs.put(name, config);
    stableRoomConfigs := Array.append(stableRoomConfigs, [(name, config)]);
  };

  public query func getRoomConfig(name: Text) : async ?RoomConfig {
    roomConfigs.get(name)
  };

  public func updateRoomConfig(name: Text, config: RoomConfig) : async () {
    roomConfigs.put(name, config);
    stableRoomConfigs := Array.map<(Text, RoomConfig), (Text, RoomConfig)>(stableRoomConfigs, func(entry) {
      if (entry.0 == name) { (name, config) } else { entry }
    });
  };

  public query func getRoomUrl(name: Text) : async Text {
    "https://your-domain.daily.co/" # name
  };

  system func preupgrade() {
    stableRoomConfigs := Iter.toArray(roomConfigs.entries());
  };

  system func postupgrade() {
    for ((name, config) in stableRoomConfigs.vals()) {
      roomConfigs.put(name, config);
    };
  };
}
