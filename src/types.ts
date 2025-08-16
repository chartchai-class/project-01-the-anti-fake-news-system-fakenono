export enum NewsStatus {
  Fake,
  Verified,
  Pending,
}

export interface News {
  id: number
  topic: string
  details: string
  status?: NewsStatus
  reporter: string
  datetime: Date
  image: string
  fakeVoteCount: number
  verifiedVoteCount: number
  comments: string[]
}

export interface NewsState {
  news: News | null
}

export interface NewsListState {
  newslist: News[] | null
}
