export async function getMicrophone(context: AudioContext) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const node = context.createMediaStreamSource(stream)

  return { stream, node }
}

export function closeStream(stream?: MediaStream) {
  if (!stream) return
  stream.getTracks().forEach((t) => t.stop())
}