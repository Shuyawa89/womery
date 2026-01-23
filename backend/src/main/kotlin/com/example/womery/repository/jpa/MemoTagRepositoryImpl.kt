package com.example.womery.repository.jpa

import com.example.womery.domain.model.Tag
import com.example.womery.repository.MemoTagRepository
import com.example.womery.repository.TagRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class MemoTagRepositoryImpl(
    private val jpaRepository: JpaMemoTagRepository,
    private val tagRepository: TagRepository
) : MemoTagRepository {

    override fun getTagsForMemo(memoId: UUID): List<Tag> {
        val tagIds = jpaRepository.findTagIdsByMemoId(memoId)
        return tagIds.mapNotNull { tagId -> tagRepository.findById(tagId) }
    }

    override fun addTagToMemo(memoId: UUID, tagId: UUID) {
        val memoTag = MemoTagEntity(memoId = memoId, tagId = tagId)
        jpaRepository.save(memoTag)
    }

    override fun removeTagFromMemo(memoId: UUID, tagId: UUID) {
        val memoTagId = MemoTagId(memoId = memoId, tagId = tagId)
        jpaRepository.deleteById(memoTagId)
    }

    override fun setTagsForMemo(memoId: UUID, tagIds: List<UUID>) {
        // Remove all existing tags
        jpaRepository.deleteByMemoId(memoId)
        // Add new tags
        tagIds.forEach { tagId ->
            addTagToMemo(memoId, tagId)
        }
    }

    override fun getMemosWithTag(tagId: UUID): List<UUID> {
        return jpaRepository.findMemoIdsByTagId(tagId)
    }

    override fun removeAllTagsFromMemo(memoId: UUID) {
        jpaRepository.deleteByMemoId(memoId)
    }
}
