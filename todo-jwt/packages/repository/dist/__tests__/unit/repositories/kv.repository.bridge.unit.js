"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('DefaultKeyValueRepository', () => {
    let ds;
    let repo;
    class Note extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    beforeEach(() => {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'kv-memory',
        });
        repo = new __1.DefaultKeyValueRepository(Note, ds);
    });
    it('implements KeyValueRepository.set()', async () => {
        const note1 = { title: 't1', content: 'c1' };
        await repo.set('note1', note1);
        const result = await repo.get('note1');
        (0, testlab_1.expect)(result).to.eql(new Note(note1));
    });
    it('implements KeyValueRepository.get() for non-existent key', async () => {
        const result = await repo.get('note1');
        (0, testlab_1.expect)(result).be.null();
    });
    it('implements KeyValueRepository.delete()', async () => {
        const note1 = { title: 't1', content: 'c1' };
        await repo.set('note1', note1);
        await repo.delete('note1');
        const result = await repo.get('note1');
        (0, testlab_1.expect)(result).be.null();
    });
    it('implements KeyValueRepository.deleteAll()', async () => {
        await repo.set('note1', { title: 't1', content: 'c1' });
        await repo.set('note2', { title: 't2', content: 'c2' });
        await repo.deleteAll();
        let result = await repo.get('note1');
        (0, testlab_1.expect)(result).be.null();
        result = await repo.get('note2');
        (0, testlab_1.expect)(result).be.null();
    });
    it('implements KeyValueRepository.ttl()', async () => {
        await repo.set('note1', { title: 't1', content: 'c1' }, { ttl: 100 });
        const result = await repo.ttl('note1');
        // The remaining ttl <= original ttl
        (0, testlab_1.expect)(result).to.be.lessThanOrEqual(100);
    });
    it('reports error from KeyValueRepository.ttl()', async () => {
        const p = repo.ttl('note2');
        return (0, testlab_1.expect)(p).to.be.rejectedWith('Cannot get TTL for unknown key "note2"');
    });
    it('implements KeyValueRepository.expire()', async () => {
        await repo.set('note1', { title: 't1', content: 'c1' }, { ttl: 100 });
        await repo.expire('note1', 200);
        const ttl = await repo.ttl('note1');
        (0, testlab_1.expect)(ttl).to.lessThanOrEqual(200);
    });
    it('implements KeyValueRepository.keys()', async () => {
        await repo.set('note1', { title: 't1', content: 'c1' });
        await repo.set('note2', { title: 't2', content: 'c2' });
        const keys = repo.keys();
        const keyList = [];
        for await (const k of keys) {
            keyList.push(k);
        }
        (0, testlab_1.expect)(keyList).to.eql(['note1', 'note2']);
    });
});
//# sourceMappingURL=kv.repository.bridge.unit.js.map