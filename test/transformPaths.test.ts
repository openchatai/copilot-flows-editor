import { describe } from 'vitest'
import petStoreSwagger from './public/swagger-pet-store.json'
import identitySwagger from './public/swagger-identity.json'
import meteringLablesSwagger from './public/swagger-metering-labels.json'
import osFlavourSwagger from './public/swagger-os-flavor-access.json'
import { transformPaths } from '../lib/utils'
import { expect } from 'vitest'
describe('transformPaths', it => {
    it('should match snapshot example 1', () => {
        expect(transformPaths(petStoreSwagger.paths as unknown as any)).toMatchSnapshot()

    })

    it('should match snapshot example 2', () => {
        expect(transformPaths(identitySwagger.paths as unknown as any)).toMatchSnapshot()
    })

    it('should match snapshot example 3', () => {
        expect(transformPaths(osFlavourSwagger.paths as unknown as any)).toMatchSnapshot()
    })

    it('should match snapshot example 4', () => {
        expect(transformPaths(meteringLablesSwagger.paths as unknown as any)).toMatchSnapshot()
    })
}
)