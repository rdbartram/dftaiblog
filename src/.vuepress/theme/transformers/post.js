import mappet from 'mappet'
import { getImagePost, getTime } from '@theme/services/utils'

const schema = {
  title: 'title',
  key: 'key',
  path: 'path',
  lang: 'frontmatter.lang',
  demo: 'frontmatter.demo',
  repo: 'frontmatter.repos',
  audio: 'frontmatter.audio',
  author: 'frontmatter.author',
  description: 'frontmatter.description',
  excerpt: 'frontmatter.excerpt',
  categories: 'frontmatter.categories',
  tags: 'frontmatter.tags',
  readtime: 'frontmatter.readtime',
  created_at: 'frontmatter.created_at',
  updated_at: 'frontmatter.updated_at',
  cover: 'frontmatter.cover',
  coverExt: 'frontmatter.coverExt',
  coverAlt: 'frontmatter.coverAlt',
  coverFullPath: 'frontmatter.coverFullPath',
  video: 'frontmatter.video',
  coverName: { path: 'path', modifier: getImagePost },
  created_time: { path: 'frontmatter.created_at', modifier: getTime }
}

export function post (data) {
  const mapper = mappet(schema)
  return data.map(item => {
    return mapper(item)
  })
}
