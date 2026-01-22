import { api } from './api'
import type {
  QuickMemo,
  CreateQuickMemoRequest,
  UpdateQuickMemoRequest,
} from '@/types/quickMemo'

const QUICK_MEMOS_PATH = '/api/quick-memos'

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
}
