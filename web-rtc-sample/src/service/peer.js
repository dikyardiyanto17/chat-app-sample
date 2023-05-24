class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
    if (!this.dataChannel) {
      this.dataChannel = this.peer.createDataChannel("message");
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      this.peer.ondatachannel = e => {
        this.dataChannel = e.channel;
        this.dataChannel.onmessage = e => {
          // console.log("New Message : ", e.data)
          this.receiveMessage(e.data)
        };
        this.dataChannel.onopen = () => console.log("Peer Connected!");
      };
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      this.dataChannel.onmessage = (e) => {
        // console.log("New message", e.data)
        this.receiveMessage(e.data)
      }
      this.peer.onicecandidate = () => console.log(JSON.stringify(this.peer.localDescription))
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async sendMessage(message) {
    this.dataChannel.send(message)
  }

  async receiveMessage (message){
    console.log("receive message", message)
    return message
  }
}

export default new PeerService();
