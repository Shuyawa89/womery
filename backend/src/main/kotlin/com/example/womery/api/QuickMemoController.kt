package com.example.womery.api

import com.example.womery.api.dto.request.CreateQuickMemoRequest
import com.example.womery.api.dto.request.UpdateQuickMemoRequest
import com.example.womery.api.dto.response.QuickMemoResponse
import com.example.womery.service.QuickMemoService
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
    private val quickMemoService: QuickMemoService
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
        return ResponseEntity.ok(quickMemos.map { QuickMemoResponse.from(it) })
    }

    @GetMapping("/{id}")
    fun getQuickMemo(@PathVariable id: UUID): ResponseEntity<QuickMemoResponse> {
        val quickMemo = quickMemoService.getQuickMemo(id)
        return ResponseEntity.ok(QuickMemoResponse.from(quickMemo))
    }

    @PutMapping("/{id}")
    fun updateQuickMemo(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateQuickMemoRequest
    ): ResponseEntity<QuickMemoResponse> {
        val quickMemo = quickMemoService.updateQuickMemo(id, request.content)
        return ResponseEntity.ok(QuickMemoResponse.from(quickMemo))
    }

    @DeleteMapping("/{id}")
    fun deleteQuickMemo(@PathVariable id: UUID): ResponseEntity<Void> {
        quickMemoService.deleteQuickMemo(id)
        return ResponseEntity.noContent().build()
    }
}
