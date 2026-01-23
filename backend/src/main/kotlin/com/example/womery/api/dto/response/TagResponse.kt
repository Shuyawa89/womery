package com.example.womery.api.dto.response

import com.example.womery.domain.model.Tag
import java.time.Instant
import java.util.UUID

data class TagResponse(
    val id: UUID,
    val name: String,
    val createdAt: Instant
) {
    companion object {
        fun from(tag: Tag): TagResponse = TagResponse(
            id = tag.id,
            name = tag.name,
            createdAt = tag.createdAt
        )
    }
}
