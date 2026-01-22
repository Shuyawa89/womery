package com.example.womery.repository

import com.example.womery.domain.model.Tag
import java.util.UUID

/**
 * Repository interface for Memo-Tag relationship management
 */
interface MemoTagRepository {
    fun getTagsForMemo(memoId: UUID): List<Tag>
    fun addTagToMemo(memoId: UUID, tagId: UUID)
    fun removeTagFromMemo(memoId: UUID, tagId: UUID)
    fun setTagsForMemo(memoId: UUID, tagIds: List<UUID>)
    fun getMemosWithTag(tagId: UUID): List<UUID>
    fun removeAllTagsFromMemo(memoId: UUID)
}
