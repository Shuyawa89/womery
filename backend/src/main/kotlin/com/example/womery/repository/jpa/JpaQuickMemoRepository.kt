package com.example.womery.repository.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaQuickMemoRepository : JpaRepository<QuickMemoEntity, UUID> {
    @Query("SELECT e FROM QuickMemoEntity e WHERE e.deletedAt IS NULL")
    fun findActiveEntities(): List<QuickMemoEntity>

    @Query("SELECT e FROM QuickMemoEntity e WHERE e.deletedAt IS NOT NULL")
    fun findDeletedEntities(): List<QuickMemoEntity>
}
