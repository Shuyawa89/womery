package com.example.womery.service

import com.example.womery.domain.model.Tag
import com.example.womery.repository.MemoTagRepository
import com.example.womery.repository.TagRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.util.UUID

@Service
@Transactional
class TagService(
    private val tagRepository: TagRepository,
    private val memoTagRepository: MemoTagRepository,
    private val clock: Clock = Clock.systemDefaultZone()
) {
    fun createTag(name: String): Tag {
        // Check if tag already exists
        tagRepository.findByName(name)?.let {
            throw TagAlreadyExistsException("Tag already exists: $name")
        }

        val tag = Tag.create(name, clock)
        return tagRepository.save(tag)
    }

    @Transactional(readOnly = true)
    fun getAllTags(): List<Tag> {
        return tagRepository.findAll()
    }

    @Transactional(readOnly = true)
    fun getTag(id: UUID): Tag {
        return tagRepository.findById(id)
            ?: throw TagNotFoundException("Tag not found: $id")
    }

    @Transactional(readOnly = true)
    fun getTagsForMemo(memoId: UUID): List<Tag> {
        return memoTagRepository.getTagsForMemo(memoId)
    }

    fun addTagToMemo(memoId: UUID, tagId: UUID) {
        // Verify tag exists
        tagRepository.findById(tagId)
            ?: throw TagNotFoundException("Tag not found: $tagId")

        memoTagRepository.addTagToMemo(memoId, tagId)
    }

    fun setTagsForMemo(memoId: UUID, tagIds: List<UUID>) {
        // Verify all tags exist
        tagIds.forEach { tagId ->
            tagRepository.findById(tagId)
                ?: throw TagNotFoundException("Tag not found: $tagId")
        }

        memoTagRepository.setTagsForMemo(memoId, tagIds)
    }

    fun removeTagFromMemo(memoId: UUID, tagId: UUID) {
        memoTagRepository.removeTagFromMemo(memoId, tagId)
    }

    fun deleteTag(id: UUID) {
        if (tagRepository.findById(id) == null) {
            throw TagNotFoundException("Tag not found: $id")
        }
        tagRepository.delete(id)
    }

    fun getOrCreateTag(name: String): Tag {
        return tagRepository.findByName(name) ?: run {
            val tag = Tag.create(name, clock)
            tagRepository.save(tag)
        }
    }
}

class TagNotFoundException(message: String) : RuntimeException(message)
class TagAlreadyExistsException(message: String) : RuntimeException(message)
