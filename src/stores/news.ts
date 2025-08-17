import type { News, NewsState } from '@/types'
import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    news:null
  }),
  actions: {
    setNews(news: News): void {
      this.news = news
    },
    addComment(comment: string): void {
      this.news?.comments.push(comment)
    },
    updateVerifiedVote() {
      if(this.news)
      this.news.verifiedVoteCount+=1
    },
    updateFakeVote() {
      if(this.news)
      this.news.fakeVoteCount+=1
    }
  
  },
})
