package models

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Type     string `json:"type" gorm:"column:user_type"` // "admin" or "user"
	Status   string `json:"status"` // "active" or "inactive"
}
