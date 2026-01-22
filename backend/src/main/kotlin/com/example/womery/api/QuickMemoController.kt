package com.example.womery.api

import com.example.womery.api.dto.request.CreateQuickMemoRequest
import com.example.womery.api.dto.request.SetTagsRequest
import com.example.womery.api.dto.request.UpdateQuickMemoRequest
import com.example.womery.api.dto.response.QuickMemoResponse
import com.example.womery.api.dto.response.TagResponse
import com.example.womery.service.QuickMemoService
import com.example.womery.service.TagService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/quick-memos")
@CrossOrigin(origins = ["http://localhost:3000"])
class QuickMemoController(
    private val quickMemoService: QuickMemoService,
    private val tagService: TagService
) {
    @PostMapping
    fun createQuickMemo(
        @Valid @RequestBody request: CreateQuickMemoRequest
    ): ResponseEntity<QuickMemoResponse> {
        val quickMemo = quickMemoService.createQuickMemo(request.content)
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(QuickMemoResponse.from(quickMemo))
    }

    @GetMapping
    fun getAllQuickMemos(): ResponseEntity<List<QuickMemoResponse>> {
        val quickMemos = quickMemoService.getAllQuickMemos()
        val responses = quickMemos.map { memo ->
            val tags = tagService.getTagsForMemo(memo.id).map { TagResponse.from(it) }
            QuickMemoResponse.from(memo, tags)
        }
        return ResponseEntity.ok(responses)
    }

    @GetMapping("/{id}")
    fun getQuickMemo(@PathVariable id: UUID): ResponseEntity<QuickMemoResponse> {
        val quickMemo = quickMemoService.getQuickMemo(id)
        val tags = tagService.getTagsForMemo(quickMemo.id).map { TagResponse.from(it) }
        return ResponseEntity.ok(QuickMemoResponse.from(quickMemo, tags))
    }

    @PutMapping("/{id}")
    fun updateQuickMemo(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateQuickMemoRequest
    ): ResponseEntity<QuickMemoResponse> {
        val quickMemo = quickMemoService.updateQuickMemo(id, request.content)
        val tags = tagService.getTagsForMemo(quickMemo.id).map { TagResponse.from(it) }
        return ResponseEntity.ok(QuickMemoResponse.from(quickMemo, tags))
    }

    @DeleteMapping("/{id}")
    fun deleteQuickMemo(@PathVariable id: UUID): ResponseEntity<Void> {
        quickMemoService.deleteQuickMemo(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/{id}/tags")
    fun getMemoTags(@PathVariable id: UUID): ResponseEntity<List<TagResponse>> {
        quickMemoService.getQuickMemo(id) // Verify memo exists
        val tags = tagService.getTagsForMemo(id)
        return ResponseEntity.ok(tags.map { TagResponse.from(it) })
    }

    @PutMapping("/{id}/tags")
    fun setMemoTags(
        @PathVariable id: UUID,
        @Valid @RequestBody request: SetTagsRequest
    ): ResponseEntity<List<TagResponse>> {
        quickMemoService.getQuickMemo(id) // Verify memo exists
        tagService.setTagsForMemo(id, request.tagIds)
        val tags = tagService.getTagsForMemo(id)
        return ResponseEntity.ok(tags.map { TagResponse.from(it) })
    }

    @PostMapping("/{id}/tags/{tagId}")
    fun addTagToMemo(
        @PathVariable id: UUID,
        @PathVariable tagId: UUID
    ): ResponseEntity<List<TagResponse>> {
        quickMemoService.getQuickMemo(id) // Verify memo exists
        tagService.addTagToMemo(id, tagId)
        val tags = tagService.getTagsForMemo(id)
        return ResponseEntity.ok(tags.map { TagResponse.from(it) })
    }

    @DeleteMapping("/{id}/tags/{tagId}")
    fun removeTagFromMemo(
        @PathVariable id: UUID,
        @PathVariable tagId: UUID
    ): ResponseEntity<List<TagResponse>> {
        quickMemoService.getQuickMemo(id) // Verify memo exists
        tagService.removeTagFromMemo(id, tagId)
        val tags = tagService.getTagsForMemo(id)
        return ResponseEntity.ok(tags.map { TagResponse.from(it) })
    }
}
