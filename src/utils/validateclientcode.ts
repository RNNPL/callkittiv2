// // Inside your useRoom hook or Host logic
// const validateClientCode = (incomingCode: string, remoteId: string) => {
//   if (incomingCode.toUpperCase() === generatedRoomCode.toUpperCase()) {
//     // Add client to the "Active Players" list
//     setPlayers((prev) => [...prev, { id: remoteId }]);
//     sendToClient(remoteId, { status: 'ACCEPTED' });
//   } else {
//     sendToClient(remoteId, { status: 'INVALID_CODE' });
//   }
// };