import {Router, Request, Response} from 'express'
import moment from 'moment'
import {Container} from 'typedi'
import {APIErrorResult, APIResult} from '../APIResult'
import UserEntity from '../../../users/entities/user.entity'
import PostsEntity from '../../../posts/entities/posts.entity'
import PostsService from '../../../posts/services/posts.service'
import CityService from '../../../posts/services/city.service'
import TypeImagesService from '../../../posts/services/typeImages.service'
import TypeVideosService from '../../../posts/services/typeVideos.service'
import TypeArticlesService from '../../../posts/services/typeArticles.service'
import PicturesService from '../../../common/services/pictures.service'
import {numberOrThrow} from '../../../utils/APIUtils'

const router = Router()

const COUNT_PER_PAGE = 20

enum CONTENT_TYPE {
  PARAGRAPH = 'paragraph',
  FIGURE = 'figure'
}

router.get('/posts/list', async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? numberOrThrow(Number(req.query.page)) : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const status = req.query.role !== undefined && Number(req.query.role) === UserEntity.ROLE.OWNER
    ? [PostsEntity.STATUS.PUBLIC, PostsEntity.STATUS.PRIVATE]
    : [PostsEntity.STATUS.PUBLIC]
  const postsService = Container.get(PostsService)
  try {
    const posts: PostsEntity[] = await postsService.getPostsList(undefined, offset, COUNT_PER_PAGE, status)
    const total = await postsService.getPostsCount(undefined, status)
    return res.json(APIResult({ posts, total, page }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// req.body = {
//    type: TYPE,
//    thumbnail: 1(id)
//    title: 'title',
//    city: 1(id),
//    image_content: 1(id),
//    video_content: 1(id),
//    article_content: 1(id),
//    published_at: timestamp,
//    status: Status
// }
router.post('/post/create', async (req: Request, res: Response) => {
  const {
    type,
    thumbnail,
    title,
    city,
    image_content,
    video_content,
    article_content
    // setPostData : 데이터 필요에 맞게 가공
  } = await setPostsData(req.body)
  // 유효성 검사
  if (type === undefined) {
    return res.status(500).json(APIErrorResult('타입을 입력해주세요.'))
  }
  if (thumbnail === undefined || thumbnail === null) {
    return res.status(500).json(APIErrorResult('썸네일을 입력해주세요.'))
  }
  if (title === undefined || title.trim() === '') {
    return res.status(500).json(APIErrorResult('제목을 입력해주세요.'))
  }
  if (city === undefined || city === null) {
    return res.status(500).json(APIErrorResult('도시를 입력해주세요.'))
  }
  if (type === PostsEntity.TYPE.IMAGE && (image_content === undefined || image_content === null)) {
    return res.status(500).json(APIErrorResult('이미지를 선택해주세요.'))
  }
  if (type === PostsEntity.TYPE.VIDEO && (video_content === undefined || video_content === null)) {
    return res.status(500).json(APIErrorResult('비디오를 선택해주세요.'))
  }
  if (type === PostsEntity.TYPE.ARTICLE && (article_content === undefined || article_content === null)) {
    return res.status(500).json(APIErrorResult('아티클을 선택해주세요.'))
  }

  // post 생성
  const postService = Container.get(PostsService)
  try {
    let _image_content = null
    let _video_content = null
    let _article_content = null
    if (type === PostsEntity.TYPE.IMAGE) {
      const { image, title, description } = image_content
      // Type_images 1개 항목을 생성함
      const typeImagesService = Container.get(TypeImagesService)
      _image_content = await typeImagesService.createTypeImage(image, title, description)
    }
    if (type === PostsEntity.TYPE.VIDEO) {
      const { poster, title, description } = video_content
      // Type_videos 1개 항목을 생성함
      const typeVideosService = Container.get(TypeVideosService)
      _video_content = await typeVideosService.createTypeVideo(poster, title, description)
    }
    if (type === PostsEntity.TYPE.ARTICLE) {
      const { cover, title, overview, contents } = article_content
      // Type_articles 1개 항목을 생성함
      const typeArticlesService = Container.get(TypeArticlesService)
      _article_content = await typeArticlesService.createTypeArticles(cover, title, overview, contents)

    }
    const post = await postService.createPost(
      type,
      thumbnail,
      title,
      city,
      _image_content,
      _video_content,
      _article_content
    )
    return res.json(APIResult({id: post.id}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.get('/post/:post_id', async (req: Request, res: Response) => {
  const post_id = numberOrThrow(Number(req.params.post_id))
  const status = req.query.role !== undefined && Number(req.query.role) === UserEntity.ROLE.OWNER
    ? [PostsEntity.STATUS.PUBLIC, PostsEntity.STATUS.PRIVATE]
    : [PostsEntity.STATUS.PUBLIC]
  const postService = Container.get(PostsService)
  try {
    const post = await postService.getPostById(post_id, status)
    const previousPost = await postService.getPreviousPostByIdAfterOrderByPublishedAt(post_id, status)
    const nextPost = await postService.getNextPostByIdAfterOrderByPublishedAt(post_id, status)
    const pagination = {
      previous: previousPost,
      next: nextPost
    }
    if (post !== undefined && post !== null) {
      if (
        post.type === PostsEntity.TYPE.ARTICLE &&
        post.article_content !== null &&
        post.article_content !== undefined
      ) {
        const picturesService = Container.get(PicturesService)
        post.article_content.contents = await Promise.all(
          post.article_content.contents.map(async (item) => {
            const { type, image: image_id } = item
            const image = await picturesService.getPictureById(image_id)
            if (type === CONTENT_TYPE.FIGURE) {
              return {
                ...item,
                image
              }
            }
            return item
          })
        )
      }
      return res.json(APIResult({ post, pagination }))
    } else {
      return res.status(500).json(APIErrorResult('페이지를 찾을 수 없습니다.'))
    }
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.patch('/post/:post_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.post_id))
  const {
    type,
    thumbnail,
    title,
    city,
    image_content,
    video_content,
    article_content,
    status,
    published_at
  } = await setPostsData(req.body)
  if (type === undefined) {
    return res.status(500).json(APIErrorResult('타입을 입력해주세요.'))
  }
  if (thumbnail === undefined || thumbnail === null) {
    return res.status(500).json(APIErrorResult('썸네일을 입력해주세요.'))
  }
  if (title === undefined || title.trim() === '') {
    return res.status(500).json(APIErrorResult('제목을 입력해주세요.'))
  }
  if (city === undefined || city === null) {
    return res.status(500).json(APIErrorResult('도시를 입력해주세요.'))
  }
  if (status === undefined) {
    return res.status(500).json(APIErrorResult('게시글 상태를 선택해주세요.'))
  }
  if (type === PostsEntity.TYPE.IMAGE && (image_content === undefined || image_content === null)) {
    return res.status(500).json(APIErrorResult('이미지를 선택해주세요.'))
  }
  if (type === PostsEntity.TYPE.VIDEO && (video_content === undefined || video_content === null)) {
    return res.status(500).json(APIErrorResult('비디오를 선택해주세요.'))
  }
  if (type === PostsEntity.TYPE.ARTICLE && (article_content === undefined || article_content === null)) {
    return res.status(500).json(APIErrorResult('아티클을 선택해주세요.'))
  }

  const postsService = Container.get(PostsService)
  try {
    let _image_content = null
    let _video_content = null
    let _article_content = null
    if (type === PostsEntity.TYPE.IMAGE) {
      const { id: content_id, image, title, description } = image_content
      // Type_images 1개 항목을 생성함
      const typeImagesService = Container.get(TypeImagesService)
      if (content_id !== null) {
        await typeImagesService.updateTypeImage(
          content_id,
          image,
          title,
          description
        )
        _image_content = await typeImagesService.getTypeImageById(content_id)
      } else {
        _image_content = await typeImagesService.createTypeImage(
          image,
          title,
          description
        )
      }
    }
    if (type === PostsEntity.TYPE.VIDEO) {
      const { id: content_id, poster, title, description } = video_content
      // Type_videos 1개 항목을 생성함
      const typeVideosService = Container.get(TypeVideosService)
      if (content_id !== null) {
        await typeVideosService.updateTypeVideo(
          content_id,
          poster,
          title,
          description
        )
        _video_content = await typeVideosService.getTypeVideoById(content_id)
      } else {
        _video_content = await typeVideosService.createTypeVideo(
          poster,
          title,
          description
        )
      }
    }
    if (type === PostsEntity.TYPE.ARTICLE) {
      const { id: content_id, cover, title, overview, content } = article_content
      // Type_articles 1개 항목을 생성함
      const typeArticlesService = Container.get(TypeArticlesService)
      if (content_id !== null) {
        await typeArticlesService.updateTypeArticles(
          content_id,
          cover,
          title,
          overview,
          content
        )
        _article_content = await typeArticlesService.getTypeArticleById(content_id)
      } else {
        _article_content = await typeArticlesService.createTypeArticles(
          cover,
          title,
          overview,
          content
        )
      }
    }
    await postsService.updatePost(
      id,
      type,
      thumbnail,
      title,
      city,
      _image_content,
      _video_content,
      _article_content,
      published_at,
      status
    )
    res.json(APIResult({ result: true }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
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
})


export default router

const setPostsData = async (body: any) => {
  const {
    type = PostsEntity.TYPE.IMAGE,
    thumbnail: thumbnail_id,
    title,
    city: city_id,
    image_content: image_content_data = null,
    video_content: video_content_data = null,
    article_content: article_content_data = null,
    published_at: published_at_unix = moment().unix(),
    status = PostsEntity.STATUS.PRIVATE
  } = body
  const picturesService = Container.get(PicturesService)
  const thumbnail = await picturesService.getPictureById(thumbnail_id)
  const cityService = Container.get(CityService)
  const city = await cityService.getCityById(city_id)
  let image_content = null
  let video_content = null
  let article_content = null
  if (image_content_data !== null) {
    const image = await picturesService.getPictureById(image_content_data.image)
    image_content = {
      id: image_content_data.id || null,
      image,
      title: image_content_data.title,
      description: image_content_data.description
    }
  }
  if (video_content_data !== null) {
    const poster = await picturesService.getPictureById(
      video_content_data.poster
    )
    video_content = {
      id: video_content_data.id || null,
      video_id: video_content_data.video_id,
      poster,
      title: video_content_data.title,
      description: video_content_data.description
    }
  }
  if (article_content_data !== null) {
    const cover = await picturesService.getPictureById(
      article_content_data.cover
    )
    console.log(article_content_data)
    article_content = {
      id: article_content_data.id || null,
      cover,
      title: article_content_data.title,
      overview: article_content_data.overview,
      content: article_content_data.content
    }
  }
  const published_at = moment.unix(published_at_unix).toDate()
  return {
    type,
    thumbnail,
    title,
    city,
    image_content,
    video_content,
    article_content,
    published_at,
    status
  }
}
