export enum NewsStatus {
  Fake = 'Fake',
  Verified = 'Verified',
  Pending = 'Pending',
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
  comments: Comment[]
}

export interface NewsState {
  news: News | null
}

export interface NewsListState {
  newslist: News[] | null
}

export interface Comment {
  id: number
  newsId: number
  commenter: string
  date: Date
  comment: string
  imgLink?: string
}

export interface CommentListState {
  commentlist: Comment[] | null
}

export interface Vote {
  id?: number
  voteType: VoteType
  voteReason?: string
  createdAt?: Date
}

export enum VoteType {
  Fake = 1,
  Real = 0,
}
