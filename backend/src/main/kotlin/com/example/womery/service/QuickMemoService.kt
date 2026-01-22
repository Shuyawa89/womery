package com.example.womery.service

import com.example.womery.domain.model.QuickMemo
import com.example.womery.repository.QuickMemoRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class QuickMemoService(
    private val quickMemoRepository: QuickMemoRepository
) {
    fun createQuickMemo(content: String): QuickMemo {
        val quickMemo = QuickMemo.create(content)
        return quickMemoRepository.save(quickMemo)
    }

    @Transactional(readOnly = true)
    fun getQuickMemo(id: UUID): QuickMemo {
        return quickMemoRepository.findById(id)
            ?: throw QuickMemoNotFoundException("QuickMemo not found: $id")
    }

    @Transactional(readOnly = true)
    fun getAllQuickMemos(): List<QuickMemo> {
        return quickMemoRepository.findAllActive()
    }

    @Transactional(readOnly = true)
    fun getDeletedQuickMemos(): List<QuickMemo> {
        return quickMemoRepository.findAllDeleted()
    }

    fun updateQuickMemo(id: UUID, content: String): QuickMemo {
        val existingMemo = quickMemoRepository.findById(id)
            ?: throw QuickMemoNotFoundException("QuickMemo not found: $id")

        val updatedMemo = existingMemo.updateContent(content)
        return quickMemoRepository.save(updatedMemo)
    }

    fun softDeleteQuickMemo(id: UUID): QuickMemo {
        val existingMemo = quickMemoRepository.findById(id)
            ?: throw QuickMemoNotFoundException("QuickMemo not found: $id")

        val deletedMemo = existingMemo.softDelete()
        return quickMemoRepository.save(deletedMemo)
    }

    fun restoreQuickMemo(id: UUID): QuickMemo {
        val existingMemo = quickMemoRepository.findById(id)
            ?: throw QuickMemoNotFoundException("QuickMemo not found: $id")

        val restoredMemo = existingMemo.restore()
        return quickMemoRepository.save(restoredMemo)
    }

    fun permanentlyDeleteQuickMemo(id: UUID) {
        if (!quickMemoRepository.existsById(id)) {
            throw QuickMemoNotFoundException("QuickMemo not found: $id")
        }
        quickMemoRepository.delete(id)
    }
}

class QuickMemoNotFoundException(message: String) : RuntimeException(message)
