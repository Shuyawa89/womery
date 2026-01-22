package com.example.womery.repository.jpa

import com.example.womery.domain.model.QuickMemo
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "quick_memos")
class QuickMemoEntity(
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    val id: UUID,

    @Column(name = "content", nullable = false, length = 1000)
    var content: String,

    @Column(name = "created_at", updatable = false, nullable = false)
    val createdAt: Instant,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant
) {
    fun toDomain(): QuickMemo = QuickMemo(
        id = id,
        content = content,
        createdAt = createdAt,
        updatedAt = updatedAt
    )

    companion object {
        fun fromDomain(quickMemo: QuickMemo): QuickMemoEntity = QuickMemoEntity(
            id = quickMemo.id,
            content = quickMemo.content,
            createdAt = quickMemo.createdAt,
            updatedAt = quickMemo.updatedAt
        )
    }
}
