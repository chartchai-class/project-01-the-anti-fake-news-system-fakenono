import CommentService from '@/services/CommentService'
import type { Comment, CommentListState } from '@/types'
import { defineStore } from 'pinia'

export const useCommentListStore = defineStore('commentlist', {
  state: (): CommentListState => ({
    commentlist: null,
  }),
  actions: {
    setCommentList(comments: Comment[]) {
      this.commentlist = comments
    },
    fetchComments(newsId: number, perPage: number, page: number) {
      CommentService.getCommentsByNewsId(newsId, perPage, page).then((response) => {
        this.commentlist = response.data
      })
    },
    addComment(comment: Comment) {
      this.commentlist?.push(comment)
    },
  },
})

export const useCommentCountStore = defineStore('commentCount', {
  state: () => ({ count: 0 }),
  actions: {
    setCount(newsId: number) {
      CommentService.getCommentsByNewsId(newsId, 1, 1).then((response) => {
        this.count = parseInt(response.headers['x-total-count'])
      })
    },
    setCountNum(count: number) {
      this.count = count
    },
  },

  getters: {
    getCount: (state) => state.count,
  },
})
