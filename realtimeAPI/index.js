// async function init() {
//     // Step 1: Fetch the ephemeral API key from your server
//     // This key is required to authenticate with the OpenAI Realtime API
//     const tokenResponse = await fetch("http://localhost:3000/session");
//     const data = await tokenResponse.json();
//     const EPHEMERAL_KEY = data.client_secret.value;

//     // Step 2: Create a WebRTC peer connection
//     // This will manage the connection for real-time communication
//     const pc = new RTCPeerConnection();

//     // Event listener to log the connection state changes
//     pc.onconnectionstatechange = () => {
//         console.log("Connection state:", pc.connectionState);
//     };

//     // Step 3: Add microphone audio as a local audio track
//     // Captures audio from the user's microphone and adds it to the peer connection
//     const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
//     pc.addTrack(ms.getTracks()[0]);

//     // Step 4: Handle remote audio received from the AI model
//     // Plays the audio received from the AI model in the browser
//     const audioEl = document.createElement("audio");
//     audioEl.autoplay = true;
//     pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

//     // Step 5: Set up a data channel for sending/receiving events
//     // The data channel is used to send instructions to the AI model and receive events
//     const dc = pc.createDataChannel("oai-events");
//     dc.addEventListener("message", (e) => {
//         const event = JSON.parse(e.data);
//         console.log("Event received:", event);
//     });

//     // Step 6: Start the WebRTC session using an SDP offer
//     // This creates an offer, sets it as the local description, and sends it to the OpenAI API
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     // Base URL and model name for the OpenAI Realtime API
//     const baseUrl = "https://api.openai.com/v1/realtime";
//     const model = "gpt-4o-mini-realtime-preview-2024-12-17";

//     // Send the SDP offer to the OpenAI API and retrieve the SDP answer
//     const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
//         method: "POST",
//         body: offer.sdp,
//         headers: {
//             Authorization: `Bearer ${EPHEMERAL_KEY}`, // Use the ephemeral API key
//             "Content-Type": "application/sdp", // Indicate the content type
//         },
//     });

//     // Set the remote description using the SDP answer received from the API
//     const answer = { type: "answer", sdp: await sdpResponse.text() };
//     await pc.setRemoteDescription(answer);

//     // Step 7: Example of sending an event to the AI model
//     // This event initializes the AI model's response and sets up the conversation
//     const responseCreate = {
//         type: "response.create", // Event type for creating a response
//         response: {
//             modalities: ["text", "audio"], // Specify that both text and audio responses are needed
//             instructions: "Begin the conversation by saying hi my name is Jakey the dentist. How can I help you today?",
//         },
//     };

//     // Send the event once the data channel is open
//     dc.addEventListener("open", () => {
//         dc.send(JSON.stringify(responseCreate));
//     });
// }

// // Initialize the WebRTC session and AI interaction
// init();
// ;