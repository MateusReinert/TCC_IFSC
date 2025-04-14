package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `json:"email" gorm:"unique"`
	Password  string    `json:"password"`
	Name      string    `json:"name"`
	UserType  string    `gorm:"column:user_type" json:"user_type"`
	CreatedAt time.Time `json:"created_at"`
	Status   string `json:"status"` // "active" or "inactive"
}
