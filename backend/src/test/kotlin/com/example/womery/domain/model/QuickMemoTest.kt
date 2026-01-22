package com.example.womery.domain.model

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class QuickMemoTest {

    @Test
    fun `create should generate QuickMemo with valid content`() {
        val content = "Buy milk"

        val memo = QuickMemo.create(content)

        assertNotNull(memo.id)
        assertEquals(content, memo.content)
        assertNotNull(memo.createdAt)
        assertNotNull(memo.updatedAt)
        assertEquals(memo.createdAt, memo.updatedAt)
    }

    @Test
    fun `create should trim whitespace from content`() {
        val content = "  Buy milk  "

        val memo = QuickMemo.create(content)

        assertEquals("Buy milk", memo.content)
    }

    @Test
    fun `create should throw exception when content is blank`() {
        val exception = assertThrows<IllegalArgumentException> {
            QuickMemo.create("   ")
        }

        assertEquals("Content cannot be blank", exception.message)
    }

    @Test
    fun `create should throw exception when content exceeds 1000 characters`() {
        val longContent = "a".repeat(1001)

        val exception = assertThrows<IllegalArgumentException> {
            QuickMemo.create(longContent)
        }

        assertEquals("Content cannot exceed 1000 characters", exception.message)
    }

    @Test
    fun `create should accept content with exactly 1000 characters`() {
        val maxContent = "a".repeat(1000)

        val memo = QuickMemo.create(maxContent)

        assertEquals(1000, memo.content.length)
    }

    @Test
    fun `updateContent should return new QuickMemo with updated content`() {
        val originalMemo = QuickMemo.create("Original content")
        val newContent = "Updated content"

        val updatedMemo = originalMemo.updateContent(newContent)

        assertEquals(originalMemo.id, updatedMemo.id)
        assertEquals(newContent, updatedMemo.content)
        assertEquals(originalMemo.createdAt, updatedMemo.createdAt)
        assertTrue(updatedMemo.updatedAt >= originalMemo.updatedAt)
    }

    @Test
    fun `updateContent should trim whitespace`() {
        val memo = QuickMemo.create("Original")

        val updated = memo.updateContent("  New content  ")

        assertEquals("New content", updated.content)
    }

    @Test
    fun `updateContent should not mutate original memo`() {
        val originalMemo = QuickMemo.create("Original content")
        val originalContent = originalMemo.content

        originalMemo.updateContent("Updated content")

        assertEquals(originalContent, originalMemo.content)
    }

    @Test
    fun `each create call should generate unique id`() {
        val memo1 = QuickMemo.create("Memo 1")
        val memo2 = QuickMemo.create("Memo 2")

        assertNotEquals(memo1.id, memo2.id)
    }
}
