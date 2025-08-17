import type { Comment, CommentListState } from "@/types";
import { defineStore } from "pinia";


export const useCommentListStore = defineStore('commentlist', {
    state: (): CommentListState => ({
        commentlist:null
    }),
    actions: {
        setCommentList(comments: Comment[]) {
            this.commentlist=comments
        }
        ,
        addComment(comment: Comment) {
            this.commentlist?.push(comment)
        }
        }
    
})

