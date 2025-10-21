import VoteCommentService from '@/services/VoteCommentService'
import type { VoteDataState } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVoteStore = defineStore('vote', () => {
  const votedNews = ref<{ [key: number]: boolean }[]>([])

  function hasVoted(newsId: number) {
    return votedNews.value.some((v) => v[newsId])
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
    resetVotes,
  }
})

export const useVoteDataStore = defineStore('voteData', {
  state: (): VoteDataState => ({ voteData: null }),
  actions: {
    setVotes(newsId: number) {
      VoteCommentService.getVote(newsId).then((response) => {
        this.voteData = response.data
      })
    },
  },
})
