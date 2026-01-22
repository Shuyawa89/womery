package com.example.womery.repository.jpa

import com.example.womery.domain.model.QuickMemo
import com.example.womery.repository.QuickMemoRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class QuickMemoRepositoryImpl(
    private val jpaRepository: JpaQuickMemoRepository
) : QuickMemoRepository {

    override fun save(quickMemo: QuickMemo): QuickMemo {
        val entity = QuickMemoEntity.fromDomain(quickMemo)
        return jpaRepository.save(entity).toDomain()
    }

    override fun findById(id: UUID): QuickMemo? {
        return jpaRepository.findById(id).orElse(null)?.toDomain()
    }

    override fun findAll(): List<QuickMemo> {
        return jpaRepository.findAll()
            .map { it.toDomain() }
            .sortedByDescending { it.createdAt }
    }

    override fun delete(id: UUID) {
        jpaRepository.deleteById(id)
    }

    override fun existsById(id: UUID): Boolean {
        return jpaRepository.existsById(id)
    }
}
