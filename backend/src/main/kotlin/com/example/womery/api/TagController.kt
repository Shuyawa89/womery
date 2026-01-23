package com.example.womery.api

import com.example.womery.api.dto.request.CreateTagRequest
import com.example.womery.api.dto.response.TagResponse
import com.example.womery.service.TagService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = ["http://localhost:3000"])
class TagController(
    private val tagService: TagService
) {
    @PostMapping
    fun createTag(
        @Valid @RequestBody request: CreateTagRequest
    ): ResponseEntity<TagResponse> {
        val tag = tagService.createTag(request.name)
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(TagResponse.from(tag))
    }

    @GetMapping
    fun getAllTags(): ResponseEntity<List<TagResponse>> {
        val tags = tagService.getAllTags()
        return ResponseEntity.ok(tags.map { TagResponse.from(it) })
    }

    @GetMapping("/{id}")
    fun getTag(@PathVariable id: UUID): ResponseEntity<TagResponse> {
        val tag = tagService.getTag(id)
        return ResponseEntity.ok(TagResponse.from(tag))
    }

    @DeleteMapping("/{id}")
    fun deleteTag(@PathVariable id: UUID): ResponseEntity<Void> {
        tagService.deleteTag(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/get-or-create")
    fun getOrCreateTag(@Valid @RequestBody request: CreateTagRequest): ResponseEntity<TagResponse> {
        val tag = tagService.getOrCreateTag(request.name)
        return ResponseEntity.ok(TagResponse.from(tag))
    }
}
