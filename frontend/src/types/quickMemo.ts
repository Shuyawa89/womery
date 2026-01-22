export interface QuickMemo {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateQuickMemoRequest {
  content: string
}

export interface UpdateQuickMemoRequest {
  content: string
}
