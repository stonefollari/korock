type Block = {
  id: number
  userId: number
  groupId: number
  name: string
  details: string
  meetingUrl: string
  videoUrl: string
  imageUrl: string
  submission: boolean
  submissionDate: string
  comments: boolean
  allowAnonymous: boolean
  createdAt: string
  updatedAt: string
}

export default Block
