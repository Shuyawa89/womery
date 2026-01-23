package com.example.womery.api.dto.request

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
import java.util.UUID

data class SetTagsRequest(
    @field:Valid
    @field:NotEmpty(message = "Tag IDs cannot be empty")
    val tagIds: List<String>
) {
    fun validate(): Boolean {
        return tagIds.all { tagId ->
            tagId.isNotBlank() && isValidUuid(tagId)
        }
    }

    private fun isValidUuid(value: String): Boolean {
        return try {
            UUID.fromString(value)
            true
        } catch (e: IllegalArgumentException) {
            false
        }
    }
}
