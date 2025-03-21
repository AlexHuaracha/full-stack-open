const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')


describe('when there is initially some blogs saved', () => {
  let token = null
  let userId = null

  beforeEach(async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
    const savedUser = await user.save()
    userId = savedUser._id

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'sekret',
      })

    token = loginResponse.body.token
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert(contents.includes('React patterns'))
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Test blog',
        author: 'Test author',
        url: 'https://test.com/',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(n => n.title)
      assert(contents.includes('Test blog'))
    })

    test('succeeds with valid data (without likes)', async () => {
      const newBlog = {
        title: 'Default likes blog',
        author: 'Test author',
        url: 'https://test.com/',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find(blog => blog.title === 'Default likes blog')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with status code 400 if data invalid (without title)', async () => {
      const newBlog = {
        author: 'Test author',
        url: 'https://test.com/',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if data invalid (without URL)', async () => {
      const newBlog = {
        title: 'Test blog',
        author: 'Test author',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Unauthorized Blog',
        author: 'Test Author',
        url: 'https://unauthorized.com/',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes('Unauthorized Blog'))
    })

    test('blogs created are associated with the correct user', async () => {
      const newBlog = {
        title: 'User-associated blog',
        author: 'Tester',
        url: 'https://userblog.com',
        likes: 3
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      const savedBlog = response.body
      assert.strictEqual(savedBlog.user.toString(), userId.toString())
    })
  })

  describe('updating a blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

      assert.strictEqual(updatedBlogAtEnd.likes, blogToUpdate.likes + 1)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      const blogToUpdate = {
        likes: 1
      }

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(blogToUpdate)
        .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      const blogToUpdate = {
        likes: 1
      }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(blogToUpdate)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
      const newBlog = {
        title: 'Blog to be deleted',
        author: 'Delete Me',
        url: 'http://delete.com',
        likes: 0
      }

      const createResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      const blogToDelete = createResponse.body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes('Blog to be deleted'))
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
// npm test -- --test-only
// npm test test/blog_api.test.js -- --test-concurrency=1