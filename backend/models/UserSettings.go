package models

import (
	"time"
)

type UserSettings struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	SettingID uint      `gorm:"not null"`
	CreatedAt time.Time `gorm:"default:current_timestamp"`
	UpdatedAt time.Time `gorm:"default:current_timestamp"`
}

func (UserSettings) TableName() string {
	return "user_settings"
}
