export function intFromObjectId(_id: any) {
  const objectIdBuffer = Buffer.from(_id.valueOf(), 'hex');
  return objectIdBuffer.readUInt32BE(0);
}