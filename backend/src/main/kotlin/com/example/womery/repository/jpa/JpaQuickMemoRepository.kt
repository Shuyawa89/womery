package com.example.womery.repository.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaQuickMemoRepository : JpaRepository<QuickMemoEntity, UUID>
