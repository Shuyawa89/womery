package com.example.womery.repository.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaTagRepository : JpaRepository<TagEntity, UUID> {
    fun findAllByOrderByNameAsc(): List<TagEntity>
    fun findByName(name: String): TagEntity?
}
