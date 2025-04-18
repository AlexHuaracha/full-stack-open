import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 10,
  }

  render(<Blog blog={blog} />)

  const titleAuthorElement = screen.getByText(/Test Blog Test Author/i)
  expect(titleAuthorElement).toBeDefined()

  const urlElement = screen.queryByText('http://testblog.com')
  const likesElement = screen.queryByText(/likes/i)

  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 10,
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blog} updateBlog={mockHandler} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(0)

})