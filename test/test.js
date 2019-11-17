'use strict'
const supertest = require('supertest')
const should = require('should')
const app = require('../src/index.js')
const server = supertest(app)

describe('CRUD Unit', () => {

    after(function() {
      app.stop()
    })

    it('CREATE', (done) => {
        server
            .post('/news/666')
            .send({title: 'Fake news', body: 'Une fake news.'})
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200)
                done()
            })
    })

    it('GET', (done) => {
        server
            .get('/news/666')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200)
                done()
            })
    })

    it('DELETE', (done) => {
        server
            .delete('/news/666')
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200)
                done()
            })
    })

})
