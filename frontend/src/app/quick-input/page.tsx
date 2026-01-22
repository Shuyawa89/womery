'use client'

import { useState } from 'react'
import { quickMemosApi } from '@/lib/quickMemos'

export default function QuickInputPage() {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Content is required' })
      return
    }

    if (content.length > 1000) {
      setMessage({ type: 'error', text: 'Content cannot exceed 1000 characters' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      await quickMemosApi.create({ content: content.trim() })
      setContent('')
      setMessage({ type: 'success', text: 'Memo saved!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save memo' })
      console.error('Error creating memo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const characterCount = content.length
  const isNearLimit = characterCount > 900
  const isAtLimit = characterCount >= 1000

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Quick Input
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quickly capture your thoughts
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-64 p-6 text-lg bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500"
              disabled={isSaving}
            />

            {/* Character Count */}
            <div
              className={`absolute bottom-4 right-4 text-sm ${
                isAtLimit
                  ? 'text-red-500 dark:text-red-400'
                  : isNearLimit
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {characterCount} / 1000
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Press Enter to save (Cmd+Enter for new line)
            </div>

            <button
              type="submit"
              disabled={isSaving || !content.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Memo
                </>
              )}
            </button>
          </div>
        </form>

        {/* Navigation */}
        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
          <a
            href="/inbox"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            View Inbox
          </a>
        </div>
      </div>
    </div>
  )
}
