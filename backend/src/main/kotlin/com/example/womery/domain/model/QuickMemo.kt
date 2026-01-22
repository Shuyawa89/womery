package com.example.womery.domain.model

import java.time.Instant
import java.util.UUID

/**
 * QuickMemo - Captured thought or note from quick input
 *
 * Domain model representing a quick memo that goes into the Inbox.
 * This is a simple entity with minimal fields for fast capture.
 */
data class QuickMemo(
    val id: UUID,
    val content: String,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    init {
        require(content.isNotBlank()) { "Content cannot be blank" }
        require(content.length <= 1000) { "Content cannot exceed 1000 characters" }
    }

    companion object {
        fun create(content: String): QuickMemo {
            val now = Instant.now()
            return QuickMemo(
                id = UUID.randomUUID(),
                content = content.trim(),
                createdAt = now,
                updatedAt = now
            )
        }
    }

    fun updateContent(newContent: String): QuickMemo {
        return copy(
            content = newContent.trim(),
            updatedAt = Instant.now()
        )
    }
}
