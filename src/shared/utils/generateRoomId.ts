export const generateRoomId = (senderId: string, receiverId: string): string => {
    return [senderId, receiverId].sort().join('_');
  };