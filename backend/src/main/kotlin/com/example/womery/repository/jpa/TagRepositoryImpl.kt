package com.example.womery.repository.jpa

import com.example.womery.domain.model.Tag
import com.example.womery.repository.TagRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class TagRepositoryImpl(
    private val jpaRepository: JpaTagRepository
) : TagRepository {

    override fun save(tag: Tag): Tag {
        val entity = TagEntity.fromDomain(tag)
        return jpaRepository.save(entity).toDomain()
    }

    override fun findById(id: UUID): Tag? {
        return jpaRepository.findById(id).orElse(null)?.toDomain()
    }

    override fun findAll(): List<Tag> {
        return jpaRepository.findAllByOrderByNameAsc()
            .map { it.toDomain() }
    }

    override fun findByName(name: String): Tag? {
        return jpaRepository.findByName(name)?.toDomain()
    }

    override fun delete(id: UUID) {
        jpaRepository.deleteById(id)
    }
}
