package com.example.womery.repository.jpa

import com.example.womery.domain.model.Tag
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "tags")
class TagEntity(
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    val id: UUID = UUID(0, 0),

    @Column(name = "name", nullable = false, length = 100, unique = true)
    var name: String = "",

    @Column(name = "created_at", updatable = false, nullable = false)
    val createdAt: Instant = Instant.EPOCH
) {
    fun toDomain(): Tag = Tag(
        id = id,
        name = name,
        createdAt = createdAt
    )

    companion object {
        fun fromDomain(tag: Tag): TagEntity = TagEntity(
            id = tag.id,
            name = tag.name,
            createdAt = tag.createdAt
        )
    }
}
