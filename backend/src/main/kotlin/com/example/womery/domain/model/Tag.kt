package com.example.womery.domain.model

import java.time.Clock
import java.time.Instant
import java.util.UUID

/**
 * Tag - Category label for organizing QuickMemos
 *
 * Domain model representing a tag that can be applied to memos.
 */
data class Tag(
    val id: UUID,
    val name: String,
    val createdAt: Instant
) {
    init {
        require(name.isNotBlank()) { "Tag name cannot be blank" }
        require(name.length <= 100) { "Tag name cannot exceed 100 characters" }
    }

    companion object {
        fun create(name: String, clock: Clock = Clock.systemDefaultZone()): Tag {
            val now = Instant.now(clock)
            return Tag(
                id = UUID.randomUUID(),
                name = name.trim(),
                createdAt = now
            )
        }
    }
}
