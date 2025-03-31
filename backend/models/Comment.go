package models

import "gorm.io/gorm"

type Comment struct {
    gorm.Model
    Content   string `json:"content"`
    PostID    uint   `json:"post_id"` // Relacionamento com a postagem
    UserEmail string `json:"user_email"`
}