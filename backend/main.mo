import Text "mo:base/Text";
import Option "mo:base/Option";

actor {
  stable var roomUrl : ?Text = null;

  // Update the room URL
  public func setRoomUrl(url : Text) : async () {
    roomUrl := ?url;
  };

  // Retrieve the room URL
  public query func getRoomUrl() : async Text {
    Option.get(roomUrl, "https://you.daily.co/hello")
  };
}
