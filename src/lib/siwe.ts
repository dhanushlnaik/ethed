import { SiweMessage } from 'siwe'

export async function createSiweMessage(address: string, statement: string, chainId: number) {
  const domain = window.location.host
  const origin = window.location.origin
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId,
  })
  return message.prepareMessage()
}
