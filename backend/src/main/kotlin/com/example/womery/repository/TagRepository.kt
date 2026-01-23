package com.example.womery.repository

import com.example.womery.domain.model.Tag
import java.util.UUID

/**
 * Repository interface for Tag persistence
 */
interface TagRepository {
    fun save(tag: Tag): Tag
    fun findById(id: UUID): Tag?
    fun findAll(): List<Tag>
    fun findByName(name: String): Tag?
    fun delete(id: UUID)
}
