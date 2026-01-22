package com.example.womery.api.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateTagRequest(
    @field:NotBlank(message = "Tag name cannot be blank")
    @field:Size(max = 100, message = "Tag name cannot exceed 100 characters")
    val name: String
)
