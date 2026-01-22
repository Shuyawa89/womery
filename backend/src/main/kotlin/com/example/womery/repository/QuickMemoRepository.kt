package com.example.womery.repository

import com.example.womery.domain.model.QuickMemo
import java.util.UUID

/**
 * Repository interface for QuickMemo persistence
 *
 * This interface defines the contract for QuickMemo data access.
 * The implementation is in the infrastructure layer (JPA).
 */
interface QuickMemoRepository {
    fun save(quickMemo: QuickMemo): QuickMemo
    fun findById(id: UUID): QuickMemo?
    fun findAll(): List<QuickMemo>
    fun delete(id: UUID)
    fun existsById(id: UUID): Boolean
}
