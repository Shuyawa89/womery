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
)

// Composite key class for MemoTag
@java.io.Serializable
data class MemoTagId(
    val memoId: UUID = UUID(0, 0),
    val tagId: UUID = UUID(0, 0)
) : java.io.Serializable
