'use client'

import { useState, useEffect } from 'react'
import { quickMemosApi } from '@/lib/quickMemos'
import type { QuickMemo } from '@/types/quickMemo'

export default function InboxPage() {
  const [memos, setMemos] = useState<QuickMemo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingMemo, setEditingMemo] = useState<{ id: string; content: string } | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadMemos()
  }, [])

  const loadMemos = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await quickMemosApi.getAll()
      setMemos(data)
    } catch (err) {
      setError('Failed to load memos')
      console.error('Error loading memos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memo?')) {
      return
    }

    setDeletingId(id)

    try {
      await quickMemosApi.delete(id)
      setMemos((prev) => prev.filter((memo) => memo.id !== id))
    } catch (err) {
      setError('Failed to delete memo')
      console.error('Error deleting memo:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditCancel = () => {
    // Prevent cancel if an update is in progress
    if (updatingId !== null) {
      return
    }
    setEditingMemo(null)
  }

  const handleEditSave = async (id: string) => {
    if (!editingMemo?.content.trim()) {
      setError('Content cannot be empty')
      return
    }

    // Check if content has actually changed
    const originalMemo = memos.find((memo) => memo.id === id)
    if (originalMemo && originalMemo.content === editingMemo.content) {
      handleEditCancel()
      return
    }

    setUpdatingId(id)

    try {
      const updated = await quickMemosApi.update(id, { content: editingMemo.content })
      setMemos((prev) => prev.map((memo) => (memo.id === id ? updated : memo)))
      // Only clear edit state if the user hasn't switched to editing another memo
      setEditingMemo((current) => (current?.id === id ? null : current))
    } catch (err) {
      setError('Failed to update memo')
      console.error('Error updating memo:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleEditSave(id)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleEditCancel()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Inbox
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {memos.length} {memos.length === 1 ? 'memo' : 'memos'}
            </p>
          </div>

          <a
            href="/quick-input"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Memo
          </a>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : memos.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
              No memos yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Start capturing your thoughts
            </p>
            <a
              href="/quick-input"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Memo
            </a>
          </div>
        ) : (
          // Memo List
          <div className="space-y-4">
            {memos.map((memo) => (
              <div
                key={memo.id}
                className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
              >
                {editingMemo?.id === memo.id ? (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <textarea
                        value={editingMemo.content}
                        onChange={(e) => setEditingMemo((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                        onKeyDown={(e) => handleKeyDown(e, memo.id)}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                        placeholder="Edit memo content..."
                        autoFocus
                      />
                      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Ctrl+Enter to save</span>
                        <span>•</span>
                        <span>Esc to cancel</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(memo.id)}
                        disabled={updatingId === memo.id}
                        className="flex-shrink-0 p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save changes"
                      >
                        {updatingId === memo.id ? (
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex-shrink-0 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Cancel editing"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap break-words">
                        {memo.content}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                        <time dateTime={memo.createdAt}>{formatDate(memo.createdAt)}</time>
                        {memo.updatedAt !== memo.createdAt && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            edited
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingMemo({ id: memo.id, content: memo.content })}
                        className="flex-shrink-0 p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit memo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(memo.id)}
                        disabled={deletingId === memo.id}
                        className="flex-shrink-0 p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete memo"
                      >
                        {deletingId === memo.id ? (
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
