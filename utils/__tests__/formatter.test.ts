import { formatAddress } from '../formatter'

describe('formatter unit test', () => {
  it('tests formatAddress', () => {
    expect(formatAddress('f')).toEqual('f...f')
    expect(formatAddress('334234234')).toEqual('334234...4234')
  })
})
