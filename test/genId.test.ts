import { assert, describe, it } from 'vitest'
import { genId } from '../lib/utils'
import { expect } from 'vitest'

describe('genId', () => {
    it("should generate a random string", () => {
        const id = genId()
        expect(id).to.be.a('string')
        expect(id).to.have.lengthOf.above(0)
    })

    it("should generate a unique string", () => {
        const id1 = genId()
        const id2 = genId()
        assert(id1 !== id2)
    })

})