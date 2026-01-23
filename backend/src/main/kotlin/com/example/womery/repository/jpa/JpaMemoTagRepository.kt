package com.example.womery.repository.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaMemoTagRepository : JpaRepository<MemoTagEntity, MemoTagId> {
    fun findByMemoId(memoId: UUID): List<MemoTagEntity>

    @Query("SELECT mt.tagId FROM MemoTagEntity mt WHERE mt.memoId = :memoId")
    fun findTagIdsByMemoId(@Param("memoId") memoId: UUID): List<UUID>

    @Query("SELECT mt.memoId FROM MemoTagEntity mt WHERE mt.tagId = :tagId")
    fun findMemoIdsByTagId(@Param("tagId") tagId: UUID): List<UUID>

    fun deleteByMemoId(memoId: UUID)
}
