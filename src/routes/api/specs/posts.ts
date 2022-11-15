import {Router, Request, Response} from 'express'
import {Container} from 'typedi'
import {APIErrorResult, APIResult} from '../APIResult'
import UserEntity from '../../../users/entities/user.entity'
import PostsEntity from '../../../posts/entities/posts.entity'
import PostsService from '../../../posts/services/posts.service'
import {numberOrThrow} from '../../../utils/APIUtils'

const router = Router()

const COUNT_PER_PAGE = 20

router.get('/posts/list', async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? numberOrThrow(Number(req.query.page)) : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const status = req.query.role !== undefined && Number(req.query.role) === UserEntity.ROLE.OWNER
    ? [PostsEntity.STATUS.PUBLIC, PostsEntity.STATUS.PRIVATE]
    : [PostsEntity.STATUS.PUBLIC]
  console.log(status)
  const postsService = Container.get(PostsService)
  try {
    const posts: PostsEntity[] = await postsService.getPostsList(undefined, offset, COUNT_PER_PAGE)
    const total = await postsService.getPostsCount()
    return res.json(APIResult({ posts, total, page }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.post('/post/create', (req: Request, res: Response) => {
  return
})

router.get('/post/:post_id', (req: Request, res: Response) => {
  return
})

router.patch('/post/:post_id', (req: Request, res: Response) => {
  return
})

router.delete('/post/:post_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.post_id))
  const postsService = Container.get(PostsService)
  try {
    await postsService.deletePost(id)
    res.json(APIResult({ result: true }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
  return
})


export default router
