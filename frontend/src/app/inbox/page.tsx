'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { quickMemosApi, tagsApi } from '@/lib/quickMemos'
import type { QuickMemo, Tag } from '@/types/quickMemo'

export default function InboxPage() {
  const [memos, setMemos] = useState<QuickMemo[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tagDialogOpen, setTagDialogOpen] = useState<string | null>(null)
  const [newTagInput, setNewTagInput] = useState('')
  const [isCreatingTag, setIsCreatingTag] = useState(false)

  // Filter memos based on search query
  const filteredMemos = useMemo(() => {
    if (!searchQuery.trim()) {
      return memos
    }
    const query = searchQuery.toLowerCase()
    return memos.filter((memo) =>
      memo.content.toLowerCase().includes(query)
    )
  }, [memos, searchQuery])

  useEffect(() => {
    loadMemos()
    loadTags()
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

  const loadTags = async () => {
    try {
      const data = await tagsApi.getAll()
      setTags(data)
    } catch (err) {
      console.error('Error loading tags:', err)
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

  const handleToggleTag = async (memoId: string, tagId: string) => {
    try {
      const memo = memos.find((m) => m.id === memoId)
      if (!memo) return

      const hasTag = memo.tags.some((t) => t.id === tagId)
      let updatedTags: Tag[]

      if (hasTag) {
        updatedTags = await quickMemosApi.removeTagFromMemo(memoId, tagId)
      } else {
        updatedTags = await quickMemosApi.addTagToMemo(memoId, tagId)
      }

      setMemos((prev) =>
        prev.map((m) => (m.id === memoId ? { ...m, tags: updatedTags } : m))
      )
    } catch (err) {
      setError('Failed to update tags')
      console.error('Error updating tags:', err)
    }
  }

  const handleCreateTag = async (memoId: string) => {
    if (!newTagInput.trim()) return

    setIsCreatingTag(true)
    setError(null)

    try {
      const newTag = await tagsApi.getOrCreate({ name: newTagInput.trim() })
      setTags((prev) => {
        const exists = prev.some((t) => t.id === newTag.id)
        if (!exists) {
          return [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name))
        }
        return prev
      })

      // Add the new tag to the memo
      const updatedTags = await quickMemosApi.addTagToMemo(memoId, newTag.id)
      setMemos((prev) =>
        prev.map((m) => (m.id === memoId ? { ...m, tags: updatedTags } : m))
      )

      setNewTagInput('')
    } catch (err) {
      setError('Failed to create tag')
      console.error('Error creating tag:', err)
    } finally {
      setIsCreatingTag(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
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
              {filteredMemos.length} {filteredMemos.length === 1 ? 'memo' : 'memos'}
              {searchQuery && ` of ${memos.length} total`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/trash"
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Trash
            </Link>
            <Link
              href="/quick-input"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Memo
            </Link>
          </div>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memos..."
              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                title="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
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
        ) : filteredMemos.length === 0 ? (
          // Empty State (no results or no memos)
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {searchQuery ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                )}
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
              {searchQuery ? 'No results found' : 'No memos yet'}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {searchQuery
                ? `No memos match "${searchQuery}"`
                : 'Start capturing your thoughts'}
            </p>
            {searchQuery ? (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Search
              </button>
            ) : (
              <Link
                href="/quick-input"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Memo
              </Link>
            )}
          </div>
        ) : (
          // Memo List
          <div className="space-y-4">
            {filteredMemos.map((memo) => (
              <div
                key={memo.id}
                className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap break-words">
                      {memo.content}
                    </p>

                    {/* Tags */}
                    {memo.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {memo.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-md"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

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

                  <div className="flex items-center gap-1">
                    {/* Tag Button */}
                    <button
                      onClick={() => setTagDialogOpen(memo.id)}
                      className="flex-shrink-0 p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Manage tags"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </button>

                    {/* Delete Button */}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tag Dialog */}
      {tagDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setTagDialogOpen(null)}
        >
          <div
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Manage Tags
              </h2>
              <button
                onClick={() => {
                  setTagDialogOpen(null)
                  setNewTagInput('')
                }}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Existing Tags */}
            <div className="mb-4 max-h-60 overflow-y-auto">
              {tags.length === 0 ? (
                <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">
                  No tags yet. Create one below.
                </p>
              ) : (
                <div className="space-y-2">
                  {tags.map((tag) => {
                    const memo = memos.find((m) => m.id === tagDialogOpen)
                    const isSelected = memo?.tags.some((t) => t.id === tag.id) ?? false

                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleToggleTag(tagDialogOpen, tag.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="flex-1 text-left">{tag.name}</span>
                        {isSelected && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Create New Tag */}
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Create New Tag
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateTag(tagDialogOpen)
                    }
                  }}
                  placeholder="Tag name..."
                  className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleCreateTag(tagDialogOpen)}
                  disabled={isCreatingTag || !newTagInput.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingTag ? '...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
