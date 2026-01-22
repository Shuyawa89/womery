package com.example.womery.api.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateQuickMemoRequest(
    @field:NotBlank(message = "Content is required")
    @field:Size(max = 1000, message = "Content cannot exceed 1000 characters")
    val content: String
)
