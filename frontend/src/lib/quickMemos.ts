import { api } from './api'
import type {
  QuickMemo,
  CreateQuickMemoRequest,
  UpdateQuickMemoRequest,
  Tag,
  SetTagsRequest,
} from '@/types/quickMemo'

const QUICK_MEMOS_PATH = '/api/quick-memos'
const TAGS_PATH = '/api/tags'

export const quickMemosApi = {
  async getAll(): Promise<QuickMemo[]> {
    return api.get<QuickMemo[]>(QUICK_MEMOS_PATH)
  },

  async getTrash(): Promise<QuickMemo[]> {
    return api.get<QuickMemo[]>(`${QUICK_MEMOS_PATH}/trash`)
  },

  async getById(id: string): Promise<QuickMemo> {
    return api.get<QuickMemo>(`${QUICK_MEMOS_PATH}/${id}`)
  },

  async create(request: CreateQuickMemoRequest): Promise<QuickMemo> {
    return api.post<QuickMemo, CreateQuickMemoRequest>(QUICK_MEMOS_PATH, request)
  },

  async update(id: string, request: UpdateQuickMemoRequest): Promise<QuickMemo> {
    return api.put<QuickMemo, UpdateQuickMemoRequest>(
      `${QUICK_MEMOS_PATH}/${id}`,
      request
    )
  },

  async softDelete(id: string): Promise<QuickMemo> {
    return api.delete<QuickMemo>(`${QUICK_MEMOS_PATH}/${id}`)
  },

  async restore(id: string): Promise<QuickMemo> {
    return api.post<QuickMemo>(`${QUICK_MEMOS_PATH}/${id}/restore`, {})
  },

  async permanentlyDelete(id: string): Promise<void> {
    return api.delete(`${QUICK_MEMOS_PATH}/${id}/permanent`)
  },

  // Tag-related methods
  async getMemoTags(id: string): Promise<Tag[]> {
    return api.get<Tag[]>(`${QUICK_MEMOS_PATH}/${id}/tags`)
  },

  async setMemoTags(id: string, request: SetTagsRequest): Promise<Tag[]> {
    return api.put<Tag[], SetTagsRequest>(`${QUICK_MEMOS_PATH}/${id}/tags`, request)
  },

  async addTagToMemo(id: string, tagId: string): Promise<Tag[]> {
    return api.post<Tag[]>(`${QUICK_MEMOS_PATH}/${id}/tags/${tagId}`, {})
  },

  async removeTagFromMemo(id: string, tagId: string): Promise<Tag[]> {
    return api.delete<Tag[]>(`${QUICK_MEMOS_PATH}/${id}/tags/${tagId}`)
  },
}

export const tagsApi = {
  async getAll(): Promise<Tag[]> {
    return api.get<Tag[]>(TAGS_PATH)
  },

  async getById(id: string): Promise<Tag> {
    return api.get<Tag>(`${TAGS_PATH}/${id}`)
  },

  async create(request: { name: string }): Promise<Tag> {
    return api.post<Tag, { name: string }>(TAGS_PATH, request)
  },

  async getOrCreate(request: { name: string }): Promise<Tag> {
    return api.post<Tag, { name: string }>(`${TAGS_PATH}/get-or-create`, request)
  },

  async delete(id: string): Promise<void> {
    return api.delete(`${TAGS_PATH}/${id}`)
  },
}
