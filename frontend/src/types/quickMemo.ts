export interface QuickMemo {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export interface CreateQuickMemoRequest {
  content: string
}

export interface UpdateQuickMemoRequest {
  content: string
}

export interface Tag {
  id: string
  name: string
  createdAt: string
}

export interface CreateTagRequest {
  name: string
}

export interface SetTagsRequest {
  tagIds: string[]
}
