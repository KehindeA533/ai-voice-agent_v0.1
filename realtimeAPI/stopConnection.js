export function stopConnection(pc) {
    if (pc) {
        pc.getSenders().forEach(sender => sender.track && sender.track.stop());
        pc.close();
        console.log("Connection closed.");
    }
}
