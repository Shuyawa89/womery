package com.example.womery.api.dto.response

import com.example.womery.domain.model.QuickMemo
import java.time.Instant
import java.util.UUID

data class QuickMemoResponse(
    val id: UUID,
    val content: String,
    val createdAt: Instant,
    val updatedAt: Instant,
    val tags: List<TagResponse> = emptyList()
) {
    companion object {
        fun from(quickMemo: QuickMemo, tags: List<TagResponse> = emptyList()): QuickMemoResponse = QuickMemoResponse(
            id = quickMemo.id,
            content = quickMemo.content,
            createdAt = quickMemo.createdAt,
            updatedAt = quickMemo.updatedAt,
            tags = tags
        )
    }
}
