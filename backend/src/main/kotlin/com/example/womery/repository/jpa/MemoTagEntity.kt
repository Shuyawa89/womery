package com.example.womery.repository.jpa

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.IdClass
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "memo_tags")
@IdClass(MemoTagId::class)
class MemoTagEntity(
    @Id
    @Column(name = "memo_id")
    val memoId: UUID,

    @Id
    @Column(name = "tag_id")
    val tagId: UUID
) {
    // No-arg constructor for JPA
    @Suppress("UNUSED")
    private constructor() : this(UUID(0, 0), UUID(0, 0))

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is MemoTagEntity) return false
        return memoId == other.memoId && tagId == other.tagId
    }

    override fun hashCode(): Int {
        var result = memoId.hashCode()
        result = 31 * result + tagId.hashCode()
        return result
    }
}

// Composite key class for MemoTag
@java.io.Serializable
data class MemoTagId(
    val memoId: UUID? = null,
    val tagId: UUID? = null
) : java.io.Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is MemoTagId) return false
        return memoId == other.memoId && tagId == other.tagId
    }

    override fun hashCode(): Int {
        var result = memoId?.hashCode() ?: 0
        result = 31 * result + (tagId?.hashCode() ?: 0)
        return result
    }
}
