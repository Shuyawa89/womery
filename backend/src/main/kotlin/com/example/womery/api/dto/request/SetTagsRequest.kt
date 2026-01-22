package com.example.womery.api.dto.request

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty

data class SetTagsRequest(
    @field:Valid
    @field:NotEmpty(message = "Tag IDs cannot be empty")
    val tagIds: List<java.util.UUID>
)
