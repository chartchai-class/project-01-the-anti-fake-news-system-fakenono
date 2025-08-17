import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://phonemyatko-cmu.github.io/mock-news-db',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getComments() {
    return apiClient.get('/db.json')
    }
    ,
    getCommentsByNewsId(id: number) {
        
       return this.getComments().then(comments => {
            
            return comments.data.filter((comment) => comment.newsId == id)

       }).catch(err => {
           console.log(err)
           return []
        }
        )
      
    }
}

