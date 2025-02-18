package models

type Password struct {
	Email       string `json:"email" gorm:"unique"`
	Password    string `json:"password"`
	NewPassword string `json:"newPassword"`
}
