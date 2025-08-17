import type { News, NewsListState } from '@/types'
import { defineStore } from 'pinia'

export const useNewsListStore = defineStore('newslist', {
  state: (): NewsListState => ({
    newslist: null,
  }),
  actions: {
    setNewsList(news: News[]) {
      this.newslist = news
    },
    addNews(news: News) {
      if (this.newslist) {
        this.newslist.push(news)
      } else {
        this.newslist = [news]
      }
    },
    updateNews(id: number, news: News) {
      if (this.newslist) {
        const index = this.newslist.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.newslist[index] = news
        }
      }
    },
    getNextId() {
      if (this.newslist && this.newslist.length > 0) {
        const maxId = Math.max(...this.newslist.map((item) => item.id))
        return maxId + 1
      }
      return 1
    },
  },
})
