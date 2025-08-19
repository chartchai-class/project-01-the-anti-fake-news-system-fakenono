import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVoteStore = defineStore('vote', () => {
  const votedNews = ref<{ [key: number]: boolean }[]>([])

  function hasVoted(newsId: number) {
    return votedNews.value.some(v => v[newsId])
  }

  function markVoted(newsId: number) {
    votedNews.value.push({ [newsId]: true })
  }

  function resetVotes() {
    votedNews.value = []
  }

  return {
    votedNews,
    hasVoted,
    markVoted,
    resetVotes
  }
})
