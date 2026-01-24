package com.example.womery.service

import com.example.womery.domain.model.Tag
import com.example.womery.repository.MemoTagRepository
import com.example.womery.repository.TagRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID
import kotlin.test.assertEquals

class TagServiceTest {

    private val tagRepository = mockk<TagRepository>()
    private val memoTagRepository = mockk<MemoTagRepository>()
    private val tagService = TagService(tagRepository, memoTagRepository)

    // setTagsForMemo tests (N+1 query fix)

    @Test
    fun `setTagsForMemo should use bulk query instead of individual queries`() {
        // Arrange
        val memoId = UUID.randomUUID()
        val tagIds = listOf(
            UUID.randomUUID(),
            UUID.randomUUID(),
            UUID.randomUUID()
        )
        val tags = tagIds.map { Tag.create("tag-$it").copy(id = it) }
        every { tagRepository.findAllByIds(tagIds) } returns tags
        every { memoTagRepository.setTagsForMemo(memoId, tagIds) } returns Unit

        // Act
        tagService.setTagsForMemo(memoId, tagIds)

        // Assert - verify bulk query was called instead of individual queries
        verify(exactly = 1) { tagRepository.findAllByIds(tagIds) }
        verify(exactly = 0) { tagRepository.findById(any()) }
        verify(exactly = 1) { memoTagRepository.setTagsForMemo(memoId, tagIds) }
    }

    @Test
    fun `setTagsForMemo should throw TagNotFoundException when some tags are missing`() {
        // Arrange
        val memoId = UUID.randomUUID()
        val tagIds = listOf(
            UUID.randomUUID(),
            UUID.randomUUID(),
            UUID.randomUUID()
        )
        val foundIds = listOf(tagIds[0], tagIds[1])
        val tags = foundIds.map { Tag.create("tag-$it").copy(id = it) }
        every { tagRepository.findAllByIds(tagIds) } returns tags

        // Act & Assert
        val exception = assertThrows<TagNotFoundException> {
            tagService.setTagsForMemo(memoId, tagIds)
        }

        assert(exception.message!!.contains(tagIds[2].toString()))
        verify(exactly = 1) { tagRepository.findAllByIds(tagIds) }
        verify(exactly = 0) { memoTagRepository.setTagsForMemo(any(), any()) }
    }

    @Test
    fun `setTagsForMemo should throw TagNotFoundException when all tags are missing`() {
        // Arrange
        val memoId = UUID.randomUUID()
        val tagIds = listOf(UUID.randomUUID(), UUID.randomUUID())
        every { tagRepository.findAllByIds(tagIds) } returns emptyList()

        // Act & Assert
        val exception = assertThrows<TagNotFoundException> {
            tagService.setTagsForMemo(memoId, tagIds)
        }

        assert(exception.message!!.contains("Tags not found"))
        verify(exactly = 1) { tagRepository.findAllByIds(tagIds) }
        verify(exactly = 0) { memoTagRepository.setTagsForMemo(any(), any()) }
    }

    @Test
    fun `setTagsForMemo should handle empty list`() {
        // Arrange
        val memoId = UUID.randomUUID()
        val tagIds = emptyList<UUID>()
        every { memoTagRepository.setTagsForMemo(memoId, tagIds) } returns Unit

        // Act
        tagService.setTagsForMemo(memoId, tagIds)

        // Assert - no query should be made for empty list
        verify(exactly = 0) { tagRepository.findAllByIds(any()) }
        verify(exactly = 1) { memoTagRepository.setTagsForMemo(memoId, tagIds) }
    }

    @Test
    fun `setTagsForMemo should handle single tag`() {
        // Arrange
        val memoId = UUID.randomUUID()
        val tagId = UUID.randomUUID()
        val tagIds = listOf(tagId)
        val tag = Tag.create("test-tag").copy(id = tagId)
        every { tagRepository.findAllByIds(tagIds) } returns listOf(tag)
        every { memoTagRepository.setTagsForMemo(memoId, tagIds) } returns Unit

        // Act
        tagService.setTagsForMemo(memoId, tagIds)

        // Assert
        verify(exactly = 1) { tagRepository.findAllByIds(tagIds) }
        verify(exactly = 1) { memoTagRepository.setTagsForMemo(memoId, tagIds) }
    }
}
