type Block = {
  id: number
  userId: number
  groupId: number
  memberId: number
  moduleId?: number
  name: string
  details: string
  meetingUrl: string
  videoUrl: string
  imageUrl: string
  date?: number | Date
  index?: number
  isResource?: boolean
  isPublic: boolean
  allowSubmission: boolean
  allowComment: boolean
  allowAnonymous: boolean
  submissionDate?: string
  createdAt: string
  updatedAt: string
}

export default Block
