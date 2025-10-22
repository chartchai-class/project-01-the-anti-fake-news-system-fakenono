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
  id?: number
  newsId?: number
  commenter?: string
  date?: Date
  comment: string
  imageLink?: string
  deleted?: boolean
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
export interface VoteData {
  realVoteCount: number
  fakeVoteCount: number
}
export enum VoteType {
  Fake = 1,
  Real = 0,
}

export interface VoteDataState {
  voteData: VoteData | null
}

// Temporarily defined for implementing authorization

export enum UserRoles {
  ROLE_READER = 'ROLE_READER',
  ROLE_MEMBER = 'ROLE_MEMBER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}
export interface User {
  id: number
  name: string
  surname: string
  username?: string
  email: string
  imageUrl: string
  roles: UserRoles[]
  postedNews?: News[]
  postedComments?: Comment[]
  createdAt: Date
}

export interface UserState {
  user: User | null
}
