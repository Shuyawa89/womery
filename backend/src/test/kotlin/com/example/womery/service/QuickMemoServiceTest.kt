package com.example.womery.service

import com.example.womery.domain.model.QuickMemo
import com.example.womery.repository.QuickMemoRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.Instant
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class QuickMemoServiceTest {

    private val quickMemoRepository = mockk<QuickMemoRepository>()
    private val quickMemoService = QuickMemoService(quickMemoRepository)

    // createQuickMemo tests

    @Test
    fun `createQuickMemo should save and return new QuickMemo`() {
        // Arrange
        val content = "Buy milk"
        val expectedMemo = QuickMemo.create(content)
        every { quickMemoRepository.save(any()) } returns expectedMemo

        // Act
        val result = quickMemoService.createQuickMemo(content)

        // Assert
        assertNotNull(result)
        assertEquals(content.trim(), result.content)
        verify(exactly = 1) { quickMemoRepository.save(any()) }
    }

    @Test
    fun `createQuickMemo should trim whitespace from content`() {
        // Arrange
        val content = "  Buy milk  "
        val expectedMemo = QuickMemo.create(content)
        every { quickMemoRepository.save(any()) } returns expectedMemo

        // Act
        val result = quickMemoService.createQuickMemo(content)

        // Assert
        assertEquals("Buy milk", result.content)
    }

    // getQuickMemo tests

    @Test
    fun `getQuickMemo should return QuickMemo when found`() {
        // Arrange
        val id = UUID.randomUUID()
        val expectedMemo = QuickMemo.create("Test content")
        val memoWithId = expectedMemo.copy(id = id)
        every { quickMemoRepository.findById(id) } returns memoWithId

        // Act
        val result = quickMemoService.getQuickMemo(id)

        // Assert
        assertNotNull(result)
        assertEquals(id, result.id)
        assertEquals("Test content", result.content)
    }

    @Test
    fun `getQuickMemo should throw QuickMemoNotFoundException when not found`() {
        // Arrange
        val id = UUID.randomUUID()
        every { quickMemoRepository.findById(id) } returns null

        // Act & Assert
        val exception = assertThrows<QuickMemoNotFoundException> {
            quickMemoService.getQuickMemo(id)
        }

        assertTrue(exception.message!!.contains(id.toString()))
        verify(exactly = 1) { quickMemoRepository.findById(id) }
    }

    // getAllQuickMemos tests

    @Test
    fun `getAllQuickMemos should return list of all QuickMemos`() {
        // Arrange
        val memo1 = QuickMemo.create("First memo")
        val memo2 = QuickMemo.create("Second memo")
        val memo3 = QuickMemo.create("Third memo")
        val expectedMemos = listOf(memo1, memo2, memo3)
        every { quickMemoRepository.findActive() } returns expectedMemos

        // Act
        val result = quickMemoService.getAllQuickMemos()

        // Assert
        assertEquals(3, result.size)
        assertEquals(expectedMemos, result)
        verify(exactly = 1) { quickMemoRepository.findActive() }
    }

    @Test
    fun `getAllQuickMemos should return empty list when no memos exist`() {
        // Arrange
        every { quickMemoRepository.findActive() } returns emptyList()

        // Act
        val result = quickMemoService.getAllQuickMemos()

        // Assert
        assertEquals(0, result.size)
        verify(exactly = 1) { quickMemoRepository.findActive() }
    }

    // updateQuickMemo tests

    @Test
    fun `updateQuickMemo should update content and return updated QuickMemo`() {
        // Arrange
        val id = UUID.randomUUID()
        val existingMemo = QuickMemo.create("Original content")
        val memoWithId = existingMemo.copy(id = id)
        val updatedMemo = memoWithId.updateContent("Updated content")

        every { quickMemoRepository.findById(id) } returns memoWithId
        every { quickMemoRepository.save(any()) } returns updatedMemo

        // Act
        val result = quickMemoService.updateQuickMemo(id, "Updated content")

        // Assert
        assertNotNull(result)
        assertEquals(id, result.id)
        assertEquals("Updated content", result.content)
        verify(exactly = 1) { quickMemoRepository.findById(id) }
        verify(exactly = 1) { quickMemoRepository.save(any()) }
    }

    @Test
    fun `updateQuickMemo should trim whitespace from updated content`() {
        // Arrange
        val id = UUID.randomUUID()
        val existingMemo = QuickMemo.create("Original")
        val memoWithId = existingMemo.copy(id = id)
        val updatedMemo = memoWithId.updateContent("New content")

        every { quickMemoRepository.findById(id) } returns memoWithId
        every { quickMemoRepository.save(any()) } returns updatedMemo

        // Act
        val result = quickMemoService.updateQuickMemo(id, "  New content  ")

        // Assert
        assertEquals("New content", result.content)
    }

    @Test
    fun `updateQuickMemo should throw QuickMemoNotFoundException when memo not found`() {
        // Arrange
        val id = UUID.randomUUID()
        every { quickMemoRepository.findById(id) } returns null

        // Act & Assert
        val exception = assertThrows<QuickMemoNotFoundException> {
            quickMemoService.updateQuickMemo(id, "New content")
        }

        assertTrue(exception.message!!.contains(id.toString()))
        verify(exactly = 1) { quickMemoRepository.findById(id) }
        verify(exactly = 0) { quickMemoRepository.save(any()) }
    }

    // deleteQuickMemo tests

    @Test
    fun `deleteQuickMemo should soft delete existing QuickMemo`() {
        // Arrange
        val id = UUID.randomUUID()
        val existingMemo = QuickMemo.create("Test memo").copy(id = id)
        val deletedMemo = existingMemo.softDelete()
        every { quickMemoRepository.findById(id) } returns existingMemo
        every { quickMemoRepository.save(any()) } returns deletedMemo

        // Act
        quickMemoService.deleteQuickMemo(id)

        // Assert
        verify(exactly = 1) { quickMemoRepository.findById(id) }
        verify(exactly = 1) { quickMemoRepository.save(any()) }
    }

    @Test
    fun `deleteQuickMemo should throw QuickMemoNotFoundException when memo not found`() {
        // Arrange
        val id = UUID.randomUUID()
        every { quickMemoRepository.findById(id) } returns null

        // Act & Assert
        val exception = assertThrows<QuickMemoNotFoundException> {
            quickMemoService.deleteQuickMemo(id)
        }

        assertTrue(exception.message!!.contains(id.toString()))
        verify(exactly = 1) { quickMemoRepository.findById(id) }
        verify(exactly = 0) { quickMemoRepository.save(any()) }
    }

    // getDeletedQuickMemos tests

    @Test
    fun `getDeletedQuickMemos should return list of deleted QuickMemos`() {
        // Arrange
        val memo1 = QuickMemo.create("First memo").softDelete()
        val memo2 = QuickMemo.create("Second memo").softDelete()
        val deletedMemos = listOf(memo1, memo2)
        every { quickMemoRepository.findDeleted() } returns deletedMemos

        // Act
        val result = quickMemoService.getDeletedQuickMemos()

        // Assert
        assertEquals(2, result.size)
        assertEquals(deletedMemos, result)
        verify(exactly = 1) { quickMemoRepository.findDeleted() }
    }

    @Test
    fun `getDeletedQuickMemos should return empty list when no deleted memos exist`() {
        // Arrange
        every { quickMemoRepository.findDeleted() } returns emptyList()

        // Act
        val result = quickMemoService.getDeletedQuickMemos()

        // Assert
        assertEquals(0, result.size)
        verify(exactly = 1) { quickMemoRepository.findDeleted() }
    }

    // restoreQuickMemo tests

    @Test
    fun `restoreQuickMemo should restore deleted QuickMemo`() {
        // Arrange
        val id = UUID.randomUUID()
        val deletedMemo = QuickMemo.create("Test memo").copy(id = id).softDelete()
        val restoredMemo = deletedMemo.restore()
        every { quickMemoRepository.findById(id) } returns deletedMemo
        every { quickMemoRepository.save(any()) } returns restoredMemo

        // Act
        val result = quickMemoService.restoreQuickMemo(id)

        // Assert
        assertNotNull(result)
        assertEquals(id, result.id)
        assertEquals("Test memo", result.content)
        assertEquals(null, result.deletedAt)
        verify(exactly = 1) { quickMemoRepository.findById(id) }
        verify(exactly = 1) { quickMemoRepository.save(any()) }
    }

    @Test
    fun `restoreQuickMemo should throw QuickMemoNotFoundException when memo not found`() {
        // Arrange
        val id = UUID.randomUUID()
        every { quickMemoRepository.findById(id) } returns null

        // Act & Assert
        val exception = assertThrows<QuickMemoNotFoundException> {
            quickMemoService.restoreQuickMemo(id)
        }

        assertTrue(exception.message!!.contains(id.toString()))
        verify(exactly = 1) { quickMemoRepository.findById(id) }
        verify(exactly = 0) { quickMemoRepository.save(any()) }
    }

    @Test
    fun `restoreQuickMemo should clear deletedAt timestamp`() {
        // Arrange
        val id = UUID.randomUUID()
        val deletedMemo = QuickMemo.create("Test").copy(id = id).softDelete()
        val restoredMemo = deletedMemo.restore()
        every { quickMemoRepository.findById(id) } returns deletedMemo
        every { quickMemoRepository.save(any()) } returns restoredMemo

        // Act
        val result = quickMemoService.restoreQuickMemo(id)

        // Assert
        assertEquals(null, result.deletedAt)
        assertFalse(result.isDeleted)
    }

    // Edge case tests

    @Test
    fun `createQuickMemo should handle maximum length content (1000 characters)`() {
        // Arrange
        val maxContent = "a".repeat(1000)
        val expectedMemo = QuickMemo.create(maxContent)
        every { quickMemoRepository.save(any()) } returns expectedMemo

        // Act
        val result = quickMemoService.createQuickMemo(maxContent)

        // Assert
        assertEquals(1000, result.content.length)
    }

    @Test
    fun `getQuickMemo should handle multiple calls independently`() {
        // Arrange
        val id1 = UUID.randomUUID()
        val id2 = UUID.randomUUID()
        val memo1 = QuickMemo.create("First").copy(id = id1)
        val memo2 = QuickMemo.create("Second").copy(id = id2)

        every { quickMemoRepository.findById(id1) } returns memo1
        every { quickMemoRepository.findById(id2) } returns memo2

        // Act
        val result1 = quickMemoService.getQuickMemo(id1)
        val result2 = quickMemoService.getQuickMemo(id2)

        // Assert
        assertEquals(id1, result1.id)
        assertEquals(id2, result2.id)
        assertEquals("First", result1.content)
        assertEquals("Second", result2.content)
    }

    @Test
    fun `updateQuickMemo should update updatedAt timestamp`() {
        // Arrange
        val id = UUID.randomUUID()
        val now = Instant.now()
        val existingMemo = QuickMemo.create("Original")
        val memoWithId = existingMemo.copy(id = id, createdAt = now, updatedAt = now)

        // Simulate time passing for update
        val updatedMemo = memoWithId.updateContent("Updated")

        every { quickMemoRepository.findById(id) } returns memoWithId
        every { quickMemoRepository.save(any()) } returns updatedMemo

        // Act
        val result = quickMemoService.updateQuickMemo(id, "Updated")

        // Assert
        assertTrue(result.updatedAt >= memoWithId.updatedAt)
    }
}
