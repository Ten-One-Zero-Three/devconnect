import { Router } from 'express'
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleUpvote,
  addComment,
} from '../controllers/post.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.post('/', requireAuth, createPost)
router.put('/:id', requireAuth, updatePost)
router.delete('/:id', requireAuth, deletePost)
router.post('/:id/upvote', requireAuth, toggleUpvote)
router.post('/:id/comments', requireAuth, addComment)

export default router
