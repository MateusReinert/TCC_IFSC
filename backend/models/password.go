package models

import "time"

type Password struct {
	Email       string `json:"email" gorm:"unique"`
	Password    string `json:"password"`
	NewPassword string `json:"newPassword"`
}

type PasswordReset struct {
    Email     string    `gorm:"primaryKey"`
    Token     string    `gorm:"primaryKey"`
    ExpiresAt time.Time
}